import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;
  @IsNumber()
  @IsNotEmpty()
  ratings: number;
  @IsString()
  @IsNotEmpty()
  comment: string;
}
