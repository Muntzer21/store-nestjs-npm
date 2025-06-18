import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesUser } from '../users/decorators/user-role.decorator';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { Roles } from '../utils/common/user-roles.enum';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @RolesUser(Roles.USER)
  @UseGuards(AuthRolesGuard)
  @Post('create')
  create(@Body() createProductDto: CreateProductDto, @CurrentUser() user) {
    return this.productService.create(createProductDto, user);
  }
  @RolesUser(Roles.USER)
  @UseGuards(AuthRolesGuard)
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @RolesUser(Roles.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Get('get-products')
  findsome() {
    return this.productService.findSome();
  }
  @RolesUser(Roles.USER)
  @UseGuards(AuthRolesGuard)
  @Get('single/:id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
  @RolesUser(Roles.USER)
  @UseGuards(AuthRolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }
  @RolesUser(Roles.USER)
  @UseGuards(AuthRolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
