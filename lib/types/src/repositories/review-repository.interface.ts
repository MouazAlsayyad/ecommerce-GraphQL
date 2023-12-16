import { ReviewEntity } from '../entities/review-entity.interface';
import {
  CreateReviewDTO,
  RemoveReviewDTO,
  ReviewDTO,
  UpdateReviewDTO,
} from '../dtos/review-dto.interface';

export interface ReviewRepository {
  getReview(data: ReviewDTO): Promise<ReviewEntity>;
  addReview(data: CreateReviewDTO): Promise<ReviewEntity>;
  updateReview(data: UpdateReviewDTO): Promise<ReviewEntity>;
  remove(data: RemoveReviewDTO): Promise<void>;
}
