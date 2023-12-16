export class CreateReviewDTO {
  userId: number;
  productId: number;
  rating: number;
  review: string;
}

export class ReviewDTO {
  userId: number;
  productId: number;
}

export class UpdateReviewDTO {
  userId: number;
  productId: number;
  rating?: number;
  review?: string;
}

export class RemoveReviewDTO {
  userId: number;
  productId: number;
}
