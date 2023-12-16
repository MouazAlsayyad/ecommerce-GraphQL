import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class FavoritesList {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  coverImage: string;

  @Field(() => Boolean)
  available: boolean;
}
