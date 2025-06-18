import { IsArray, IsNumber, IsString } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateProductDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsNumber()
  price: number;
  @IsNumber()
  stock: number;
  @IsArray()
  images: string[];
  @IsNumber()
  category_id: number;
}
