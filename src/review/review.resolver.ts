import { Resolver, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { ContextType } from 'src/unit/context-type';
import { Logger } from '@nestjs/common';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}
  private readonly logger = new Logger(ReviewResolver.name);
  @Roles(UserType.USER, UserType.ADMIN)
  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.reviewService.addReview(
        createReviewInput,
        context.req.user.id,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Mutation(() => Review)
  updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.reviewService.updateReview(
        updateReviewInput,
        context.req.user.id,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Mutation(() => Boolean)
  removeReview(
    @Context() context: ContextType,
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    try {
      return this.reviewService.removeReview(productId, context.req.user.id);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
