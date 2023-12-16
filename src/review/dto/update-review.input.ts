import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateReviewInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  review?: string;
}

@InputType()
export class DeleteReviewInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
