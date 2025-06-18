import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryReposirty: Repository<Category>,
    // private readonly jwtService: JwtService,
  ) {}

  /**
   * to create a new category
   * @param createCategoryDto body of the request
   * @param currentUser current user who is creating the category
   * @returns new category in DB
   */
  async create(createCategoryDto: CreateCategoryDto, currentUser: User) {
    const category = this.categoryReposirty.create(createCategoryDto);
    category.addedBy = currentUser;
    return this.categoryReposirty.save(category);
  }

  /**
   * to get all categories
   * @returns all categories in the DB
   */
  findAll() {
    return this.categoryReposirty.find();
  }

  /**
   * to find a category by its id
   * @param id category id
   * @returns category object
   */
  async findOne(id: number) {
    const category = await this.categoryReposirty.findOne({
      where: { category_id: id },
    });
    if (!category) throw new BadRequestException('the category its not found');
    return category;
  }

  /**
   * update a category by its id
   * @param id category id
   * @param fields to update in the category
   * @returns updated category object
   */
  async update(id: number, fields: Partial<UpdateCategoryDto>) {
    const category = await this.categoryReposirty.findOne({
      where: { category_id: id },
    });
    if (!category) throw new BadRequestException('the category its not found');
    Object.assign(category, fields);

    return this.categoryReposirty.save(category);
  }

  /**
   * delete a category by its id
   * @param id category id
   * @returns deleted category message
   */
  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
