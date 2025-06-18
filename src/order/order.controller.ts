import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { AuthGuard } from '../users/guards/auth.guard';
import { UpdateOrderSatus } from './dto/update-order-status.dto';
import { log } from 'console';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() currentUser) {
    return this.orderService.create(createOrderDto, currentUser.id);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderSatus,
    @CurrentUser() currentUser,
  ) {
    return this.orderService.update(+id, updateOrderDto, currentUser);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
