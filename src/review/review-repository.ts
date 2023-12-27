import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ForbiddenError } from '@nestjs/apollo';
import { PrismaService } from 'src/prisma/prisma.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import {
  checkProductExit,
  updateProductReviewInfo,
} from './utils/review-service-utils';
import { UpdateReviewInput } from './dto/update-review.input';

@Injectable()
export class PrismaReviewRepository {
  constructor(private readonly prisma: PrismaService) {}
  getAllReviewsByProductId(productId: number) {
    return this.prisma.userReview.findMany({
      where: { productId },
    });
  }

  getReview(productId: number, userId: number): Promise<Review> {
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

  addReview(userId: number, data: CreateReviewInput): Promise<Review> {
    return this.prisma.$transaction(async (tx) => {
      const { rating, review, productId } = data;
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

  updateReview(userId: number, data: UpdateReviewInput): Promise<Review> {
    return this.prisma.$transaction(async (tx) => {
      const { productId } = data;

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

  remove(productId: number, userId: number): Promise<void> {
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
