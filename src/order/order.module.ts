import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersProducts } from './entities/orders.producta.entity';
import { Shipping } from './entities/shipping.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports:[ JwtModule,TypeOrmModule.forFeature([Order,OrdersProducts,Shipping]),UsersModule,ProductModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
