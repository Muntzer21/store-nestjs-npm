import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoryModule } from '../category/category.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[JwtModule,TypeOrmModule.forFeature([Product]),CategoryModule,UsersModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports :[ProductService]
})
export class ProductModule {}
