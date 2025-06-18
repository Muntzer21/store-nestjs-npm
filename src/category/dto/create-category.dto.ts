import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'title must be string' })
  title: string;
  @IsString({ message: 'title must be string' })
  description: string;
}
