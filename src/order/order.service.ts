import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProducts } from './entities/orders.producta.entity';
import { Shipping } from './entities/shipping.entity';
import { UsersService } from '../users/users.service';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { OrderStatus } from './enums/oders-status';
import { UpdateOrderSatus } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderReposirty: Repository<Order>,
    @InjectRepository(OrdersProducts)
    private readonly opReposirty: Repository<OrdersProducts>,
    private readonly userService: UsersService,
    private readonly productService: ProductService,
  ) {}

  /**
   * create a new order
   * @param createOrderDto body of the request
   * @param user_id user id who is creating the order
   * @returns new order in DB
   */
  async create(createOrderDto: CreateOrderDto, user_id: number) {
    
    const shipping = new Shipping();
    Object.assign(shipping, createOrderDto.shippingAddress);

    const orderEn = new Order();
    orderEn.shipping_address = shipping;
    const getUser = await this.userService.findOne(user_id);
    orderEn.user = getUser;

    const orderTbl = await this.orderReposirty.save(orderEn);

    let opEntity: {
      order: Order;
      product: Product;
      product_quantity: number;
      product_unit_price: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const order = orderTbl;
      const product = await this.productService.findOne(
        createOrderDto.orderedProducts[i].id,
      );
      const product_quantity =
        createOrderDto.orderedProducts[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderedProducts[i].product_unit_price;
      opEntity.push({
        order,
        product,
        product_quantity,
        product_unit_price,
      });
    }
    const op = await this.opReposirty
      .createQueryBuilder()
      .insert()
      .into(OrdersProducts)
      .values(opEntity)
      .execute();
    return await this.findOne(orderTbl.order_id);
  }

  findAll() {
    return `This action returns all order`;
  }

  /**
   * to find an order by its id
   * @param id order id
   * @returns order object with its relations
   */
  findOne(id: number) {
    return this.orderReposirty.findOne({
      where: {
        order_id: id,
      },
      relations: {
        shipping_address: true,
        user: true,
        products: { product: true },
      },
    });
  }

  /**
   * to update an order status by its id 
   * @param id order id
   * @param updateOrderDto update order status dto
   * @param user_id user id who is updating the order
   * @returns updated order object
   */
  async update(id: number, updateOrderDto: UpdateOrderSatus, user_id: number) {
    let order = await this.findOne(id);
    if (!order) throw new BadRequestException('the order is not found');
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CENCELLED
    )
      throw new BadRequestException('order already ');
    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderDto.status === OrderStatus.SHIPPED
    )
      throw new BadRequestException('delivered befor shipped!');
    if (
      updateOrderDto.status === OrderStatus.SHIPPED &&
      order.status === OrderStatus.SHIPPED
    )
      return order;
    if (updateOrderDto.status === OrderStatus.SHIPPED)
      order.shippedAt = new Date();
    if (updateOrderDto.status === OrderStatus.DELIVERED)
      order.deliveredAt = new Date();

    order.status = updateOrderDto.status;
    const user = await this.userService.findOne(user_id);
    order.updatedBy =user;
    order = await this.orderReposirty.save(order);
    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
