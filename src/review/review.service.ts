import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';


@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewReposirty: Repository<Review>,
    // private readonly categoryService: CategoryService,
    private readonly userService: UsersService,
    private readonly productService: ProductService,
    // private readonly jwtService: JwtService,
  ) { }
  /**
   * take review from user and product and save it in DB
   * @param createReviewDto body of the request
   * @param currentUser current user who is creating the review
   * @returns new review in DB
   */
  async create(createReviewDto: CreateReviewDto, currentUser) {
    const product = await this.productService.findOne(
      createReviewDto.product_id,
    );

    const user = await this.userService.findOne(currentUser.id);
    let review = await this.findOneByUserAndProduct(
      user.user_id,
      product.product_id,
    );
    if (!review) {
      review = this.reviewReposirty.create(createReviewDto);
      review.product = product;
      review.user = user;
    } else {
      review.comment = createReviewDto.comment;
      review.ratings = createReviewDto.ratings;
    }
    return this.reviewReposirty.save(review);
  }

  findAll() {
    return `This action returns all review`;
  }

  /**
   * to get all reviews for a specific product
   * @param product_id id of the product to find all reviews for it
   * @returns product reviews with relations
   */
  async findAllByProduct(product_id: number) {
    const product = await this.productService.findOne(product_id);
    return this.reviewReposirty.find({
      where: { product: product },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }

  /**
   * to find a review by its id
   * @param id id of the review to find
   * @returns product review with relations
   */
  async findOne(id: number) {
    const review = await this.reviewReposirty.findOne({
      where: { review_id: id },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
    if (!review) throw new BadRequestException('the review its not found');
    return review;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return this.reviewReposirty.delete(id);
  }

  /**
   * to find a review by user id and product id
   * @param user_id user id who created the review
   * @param product_id product id to find the review for
   * @returns review object if found, otherwise null
   */
  private async findOneByUserAndProduct(user_id: number, product_id: number) {
    const review = await this.reviewReposirty.findOne({
      where: {
        user: { user_id: user_id },
        product: { product_id: product_id },
      },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
    return review;
  }
}
