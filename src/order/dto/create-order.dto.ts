import { Type } from "class-transformer";
import { CreateShippingDto } from "./create-shipping.dto";
import { ValidateNested } from "class-validator";
import { OrderProuctsDto } from "./ordered-products.dto";

export class CreateOrderDto {
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shippingAddress: CreateShippingDto;

  @Type(() => OrderProuctsDto)
  @ValidateNested()
  orderedProducts: OrderProuctsDto[];
}
