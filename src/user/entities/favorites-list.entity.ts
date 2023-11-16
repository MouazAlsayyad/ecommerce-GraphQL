import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class FavoritesList {
  @Field(() => Int)
  itemId: number;

  @Field(() => Int)
  userId: number;
}
