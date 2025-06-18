import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateShippingDto{
    @IsString()
      phone: string;
      @IsString()
      @IsOptional()
      name: string;
      @IsString()
      address: string;
      @IsString()
      city: string;
    
      @IsString()
      postcode: string;
      @IsString()
      state: string;
      @IsString()
      country: string;
}