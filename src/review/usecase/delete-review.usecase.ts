import { ReviewRepository, UseCase } from 'lib/types/src';
import { DeleteReviewInput } from '../dto/update-review.input';
import { Review } from '../entities/review.entity';

export class DeleteReviewUseCase
  implements UseCase<DeleteReviewInput, Promise<Review>>
{
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(data: DeleteReviewInput): Promise<Review> {
    const review = await this.reviewRepository.getReview(data);
    await this.reviewRepository.remove(data);
    return review;
  }
}
