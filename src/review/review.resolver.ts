import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { UserType } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ContextType } from 'src/unit/context-type';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Roles(UserType.USER)
  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @Args('productId') productId: number,
    @Context() context: ContextType,
  ) {
    return this.reviewService.addReview(productId, context, createReviewInput);
  }

  @Query(() => [Review], { name: 'review' })
  findAll(@Args('productId') productId: number) {
    return this.reviewService.findAll(productId);
  }

  // @Query(() => Review, { name: 'review' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.reviewService.findOne(id);
  // }
  @Roles(UserType.USER)
  @Mutation(() => Review)
  updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
    @Context() context: ContextType,
  ) {
    return this.reviewService.update(
      updateReviewInput.id,
      updateReviewInput,
      context,
    );
  }
  @Roles(UserType.USER)
  @Mutation(() => Review)
  removeReview(
    @Args('id', { type: () => Int }) id: number,
    @Context() context,
  ) {
    return this.reviewService.remove(id, context);
  }
}
