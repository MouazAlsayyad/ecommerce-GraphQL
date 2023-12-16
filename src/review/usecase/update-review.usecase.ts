import { ReviewRepository, UseCase } from 'lib/types/src';
import { UpdateReviewInput } from '../dto/update-review.input';
import { Review } from '../entities/review.entity';

export class UpdateReviewUseCase
  implements UseCase<UpdateReviewInput, Promise<Review>>
{
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(data: UpdateReviewInput & { userId: number }): Promise<Review> {
    return await this.reviewRepository.updateReview(data);
  }
}
