import { Injectable } from '@nestjs/common';
import {
  AddReviewUseCase,
  DeleteReviewUseCase,
  UpdateReviewUseCase,
} from './usecase';
import { PrismaReviewRepository } from 'src/prisma/repositories';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

@Injectable()
export class ReviewService {
  constructor(private reviewRepository: PrismaReviewRepository) {}

  create(data: CreateReviewInput, userId: number) {
    const addReviewUseCase = new AddReviewUseCase(this.reviewRepository);
    return addReviewUseCase.execute({ ...data, userId });
  }
  update(data: UpdateReviewInput, userId: number) {
    const updateReviewUseCase = new UpdateReviewUseCase(this.reviewRepository);
    return updateReviewUseCase.execute({ ...data, userId });
  }

  remove(productId: number, userId: number) {
    const deleteReviewUseCase = new DeleteReviewUseCase(this.reviewRepository);
    return deleteReviewUseCase.execute({ productId, userId });
  }
}
