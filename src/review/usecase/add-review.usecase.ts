import { ReviewRepository, UseCase } from 'lib/types/src';
import { CreateReviewInput } from '../dto/create-review.input';
import { Review } from '../entities/review.entity';

export class AddReviewUseCase
  implements UseCase<CreateReviewInput, Promise<Review>>
{
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(data: CreateReviewInput & { userId: number }): Promise<Review> {
    return await this.reviewRepository.addReview(data);
  }
}
