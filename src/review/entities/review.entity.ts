import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Review {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  review: string;

  @Field(() => Float)
  rating: number;
}
