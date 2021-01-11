import { getMongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';

import AppError from '../errors/AppError';
import Product from '../models/Product';

import Storage from '../utils/storage';

interface IRequest {
  productId: string;
  arrImages: Array<string>;
}

class UpdateProductImagesService {
  async execute({ productId, arrImages }: IRequest): Promise<Product> {
    const productsRepository = getMongoRepository(Product);

    const product = await productsRepository.findOne({
      where: { _id: new ObjectID(productId) },
    });

    if (!product) {
      throw new AppError("Product doesn't found.", 404);
    }

    const storage = new Storage();

    if (product.images) {
      if (process.env.STORAGE_DRIVER === 's3') {
        await storage.deleteFilesInS3({
          productImages: product.images,
          bucket: 'images-all-products',
        });
      } else {
        await storage.deleteFilesInDisk(product.images);
      }
    }

    if (process.env.STORAGE_DRIVER === 's3') {
      await storage.saveFilesInS3({
        productImages: arrImages,
        bucket: 'images-all-products',
      });
    }

    product.images = arrImages;
    product.updated_at = new Date();

    await productsRepository.save(product);

    return product;
  }
}

export default UpdateProductImagesService;
