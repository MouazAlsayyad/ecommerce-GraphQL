import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Review {
  @Field()
  rating: number;
  @Field()
  review: string;
}
