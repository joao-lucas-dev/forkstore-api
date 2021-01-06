import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
class Product {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  images: Array<string>;

  @Column()
  price: number;

  @Column()
  oldPrice: number;

  @Column()
  discount: number;

  @Column()
  isActive: boolean;

  @Column()
  color: Array<string>;

  @Column()
  type: Array<string>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
