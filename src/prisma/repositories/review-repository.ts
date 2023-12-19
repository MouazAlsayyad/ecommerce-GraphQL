import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateReviewDTO,
  RemoveReviewDTO,
  ReviewDTO,
  ReviewEntity,
  UpdateReviewDTO,
} from 'lib/types/src';

import {
  checkProductExit,
  updateProductReviewInfo,
} from '../utils/review-service-utils';
import { ForbiddenError } from '@nestjs/apollo';

@Injectable()
export class PrismaReviewRepository {
  constructor(private readonly prisma: PrismaService) {}
  getReview(data: ReviewDTO): Promise<ReviewEntity> {
    const { productId, userId } = data;
    return this.prisma.$transaction(async (tx) => {
      const userRating = await tx.userReview.findFirst({
        where: { AND: [{ userId }, { productId }] },
      });

      if (!userRating)
        throw new NotFoundException(
          `Rating for Product with ID ${productId} not found`,
        );

      return userRating;
    });
  }

  addReview(data: CreateReviewDTO): Promise<ReviewEntity> {
    return this.prisma.$transaction(async (tx) => {
      const { rating, review, productId, userId } = data;
      await checkProductExit(productId, tx);
      const userReview = await tx.userReview.findFirst({
        where: { AND: [{ userId }, { productId }] },
      });

      if (userReview)
        throw new BadRequestException(
          'You have already rated this product. You can edit the existing rating',
        );

      const createdReview = await tx.userReview.create({
        data: { userId, productId, rating, review },
      });
      await updateProductReviewInfo(productId, tx);

      return createdReview;
    });
  }

  updateReview(data: UpdateReviewDTO): Promise<ReviewEntity> {
    return this.prisma.$transaction(async (tx) => {
      const { productId, userId } = data;

      const userRating = await tx.userReview.findFirst({
        where: { AND: [{ userId }, { productId }] },
      });

      if (!userRating)
        throw new NotFoundException(
          `Rating for Product with ID ${productId} not found`,
        );

      if (userRating.userId !== userId)
        throw new ForbiddenError('This review is not owned by you');

      await updateProductReviewInfo(userRating.productId, tx);

      return tx.userReview.update({
        where: { id: userRating.id },
        data: { rating: data.rating, review: data.review },
      });
    });
  }

  remove(data: RemoveReviewDTO): Promise<void> {
    const { productId, userId } = data;
    return this.prisma.$transaction(async (tx) => {
      const userRating = await tx.userReview.findFirst({
        where: { AND: [{ userId }, { productId }] },
      });

      if (!userRating)
        throw new NotFoundException(
          `Rating for Product with ID ${productId} not found`,
        );
      if (userRating.userId !== userId)
        throw new ForbiddenError('Forbidden resource');

      await tx.userReview.delete({ where: { id: userRating.id } });

      await updateProductReviewInfo(productId, tx);
      return;
    });
  }
}
