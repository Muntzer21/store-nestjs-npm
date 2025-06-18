import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { OrderStatus } from '../enums/oders-status';
import { User } from '../../users/entities/user.entity';
import { Shipping } from './shipping.entity';
import { OrdersProducts } from './orders.producta.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;
  @CreateDateColumn()
  orderAt: Timestamp;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;
  @Column({ nullable: true })
  shippedAt: Date;
  @Column({ nullable: true })
  deliveredAt: Date;
  @ManyToOne(() => User, (user) => user.ordersUpdateBy)
  updatedBy: User;

  @OneToOne(() => Shipping, (ship) => ship.order, { cascade: true })
  @JoinColumn()
  shipping_address: Shipping;

  @OneToMany(() => OrdersProducts, (op) => op.order, { cascade: true })
    products: OrdersProducts[];
    
    @ManyToOne(() => User, (user) => user.orders)
    user : User
}
