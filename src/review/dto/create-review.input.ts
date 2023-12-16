import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsString, Max, Min } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field()
  @IsNumber()
  productId: number;
  @Field()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @Field()
  @IsString()
  review: string;
}
