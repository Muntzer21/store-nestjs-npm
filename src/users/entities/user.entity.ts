// Update the import path below if the actual path is different, e.g.:
import { Category } from '../../category/entities/category.entity';
import { Order } from '../../order/entities/order.entity';
import { Product } from '../../product/entities/product.entity';
import { Review } from '../../review/entities/review.entity';
import { Roles } from '../../utils/common/user-roles.enum';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  password: string;
  @Column({ type: 'enum', enum: Roles, default: [Roles.USER] })
  roles: Roles;
  @CreateDateColumn()
  createAt: Timestamp;
  @UpdateDateColumn()
  updateAt: Timestamp;

  // @Column({ nullable: true })
  // reset_code: string;

  // @Column({ nullable: true, type: 'timestamp' })
  // reset_code_expiry: Date;

  @OneToMany(() => Category, (category) => category.addedBy)
  categories: Category[];

  @OneToMany(() => Product, (prod) => prod.addedBy)
  products: Product[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.updatedBy)
  ordersUpdateBy: Order[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
