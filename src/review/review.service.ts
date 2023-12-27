import { Injectable } from '@nestjs/common';

import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { PrismaReviewRepository } from './review-repository';

@Injectable()
export class ReviewService {
  constructor(private reviewRepository: PrismaReviewRepository) {}

  addReview(data: CreateReviewInput, userId: number) {
    return this.reviewRepository.addReview(userId, data);
  }
  updateReview(data: UpdateReviewInput, userId: number) {
    return this.reviewRepository.updateReview(userId, data);
  }
  getAllReviewsByProductId(id: number) {
    return this.reviewRepository.getAllReviewsByProductId(id);
  }

  removeReview(productId: number, userId: number) {
    return this.reviewRepository.remove(userId, productId);
  }
}
