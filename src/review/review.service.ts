import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContextType } from 'src/unit/context-type';
import { Prisma, UserType } from '@prisma/client';
import { ForbiddenError } from '@nestjs/apollo';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(ReviewService.name);

  private async updateProductReviewInfo(
    productId: number,
    tx: Prisma.TransactionClient,
  ) {
    const reviews = await tx.userReview.findMany({
      where: { productId },
    });

    const reviewCount = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    await tx.product.update({
      where: { id: productId },
      data: {
        averageRating,
        reviewCount,
      },
    });
  }

  async addReview(
    productId: number,
    context: ContextType,
    reviewDto: CreateReviewInput,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const { rating, review } = reviewDto;
      const userId = context.req.user.id;
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      const userReview = await tx.userReview.findFirst({
        where: {
          AND: [
            {
              userId,
            },
            {
              productId,
            },
          ],
        },
      });

      if (userReview) {
        throw new BadRequestException(
          'You have already rated this product. You can edit the existing rating',
        );
      }

      const createdReview = await tx.userReview.create({
        data: {
          userId,
          productId,
          rating,
          review,
        },
      });

      // Update the average rating and review count for the associated product
      await this.updateProductReviewInfo(productId, tx);

      return createdReview;
    });
  }

  findAll(productId: number) {
    return this.prisma.$transaction(async (tx) => {
      return await tx.userReview.findMany({
        where: {
          productId,
        },
      });
    });
  }

  update(
    id: number,
    updateReviewInput: UpdateReviewInput,
    context: ContextType,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const userId = context.req.user.id;

      const userRating = await tx.userReview.findUnique({
        where: { id },
      });

      if (!userRating) {
        throw new NotFoundException(`Rating with ID ${id} not found`);
      }

      if (userRating.userId !== userId)
        throw new ForbiddenError('This review is not owned by you');

      await this.updateProductReviewInfo(userRating.productId, tx);

      return tx.userReview.update({
        where: { id },
        data: {
          rating: updateReviewInput.rating,
          review: updateReviewInput.review,
        },
      });
    });
  }

  remove(id: number, context) {
    return this.prisma.$transaction(async (tx) => {
      const userId = context.req.user.id;
      const userType = context.req.user.userType;
      const userRating = await tx.userReview.findUnique({
        where: { id },
      });

      if (!userRating)
        throw new NotFoundException(`Rating with ID ${id} not found`);
      this.logger.log(userType, userRating.userId, userId);
      if (userRating.userId !== userId)
        throw new ForbiddenError('Forbidden resource');

      const rating = tx.userReview.delete({
        where: { id },
      });

      await this.updateProductReviewInfo(userRating.productId, tx);
      return rating;
    });
  }
}
