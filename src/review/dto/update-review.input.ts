import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { CreateReviewInput } from './create-review.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  id: number;
}
