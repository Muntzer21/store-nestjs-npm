import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productReposirty: Repository<Product>,
    private readonly categoryService: CategoryService,
    private readonly userService: UsersService,
    // private readonly jwtService: JwtService,
  ) {}
  /**
   * to create a new product
   * @param createProductDto body of the request
   * @param user new user who is creating the product
   * @returns new product in DB
   */
  async create(createProductDto: CreateProductDto, user: User) {
    const category = await this.categoryService.findOne(
      createProductDto.category_id,
    );
    const get_user = await this.userService.findOne(user.user_id);
    const product = this.productReposirty.create(createProductDto);
    product.category = category;

    product.addedBy = get_user;

    return this.productReposirty.save(product);
  }

  /**
   * get all products
   * @returns all products in the DB
   */
  findAll() {
    return this.productReposirty.find();
  }

  /**
   * get all products
   * @returns all products in the DB
   */
  findSome() {
    return this.productReposirty.find({
      skip: 7, 
      take: 6, 
    });
  }

  /**
   * to find a product by its id
   * @param id product id
   * @returns product objectwith its relations
   */
  async findOne(id: number) {
    const product = await this.productReposirty.findOne({
      where: { product_id: id },
      relations: { addedBy: true, category: true },
      select: {
        addedBy: {
          user_id: true,
          email: true,
          name: true,
        },
        category: {
          category_id: true,
          title: true,
        },
      },
    });
    if (!product) throw new BadRequestException('the product its not found');
    return product;
  }

  /**
   * to update a product by its id
   * @param id product id
   * @param updateProductDto
   * @returns new updated product object
   */
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    // if (product.category) {
    //   c
    // }
    return this.productReposirty.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
