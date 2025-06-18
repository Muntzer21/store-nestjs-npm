import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { OrdersProducts } from "../entities/orders.producta.entity";
import { OrderStatus } from "../enums/oders-status";

export class UpdateOrderSatus{
    @IsNotEmpty()
    @IsString()
    @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED])
    status: OrderStatus;
}