import { getMongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';

import AppError from '../errors/AppError';

import Product from '../models/Product';

interface IRequest {
  productId: string;
  title: string;
  description: string;
  price: number;
  oldPrice: number;
  isActive: boolean;
  color: Array<string>;
  type: Array<string>;
}

class UpdateProductService {
  async execute({
    productId,
    title,
    description,
    price,
    oldPrice,
    isActive,
    color,
    type,
  }: IRequest): Promise<Product> {
    const productsRepository = getMongoRepository(Product);

    const product = await productsRepository.findOne({
      where: { _id: new ObjectID(productId) },
    });

    if (!product) {
      throw new AppError("Product doesn't found.", 404);
    }

    product.title = title;
    product.description = description;
    product.price = price;
    product.oldPrice = oldPrice;
    product.isActive = isActive;
    product.color = color;
    product.type = type;
    product.discount =
      oldPrice > price ? Number((oldPrice - price).toFixed(2)) : 0;
    product.updated_at = new Date();

    await productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;