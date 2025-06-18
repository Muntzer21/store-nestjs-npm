import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard';
import { RolesUser } from '../users/decorators/user-role.decorator';
import { Roles } from '../utils/common/user-roles.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @RolesUser(Roles.USER)
  @UseGuards(AuthRolesGuard)
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    console.log('hi');

    return this.categoryService.create(createCategoryDto, req['user']);
  }

  @Get()
  @RolesUser(Roles.ADMIN)
  @UseGuards(AuthRolesGuard)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('single/:id')
  @RolesUser(Roles.ADMIN)
  @UseGuards(AuthRolesGuard)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch('update/:id')
  @RolesUser(Roles.ADMIN)
  @UseGuards(AuthRolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @RolesUser(Roles.ADMIN)
  @UseGuards(AuthRolesGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
