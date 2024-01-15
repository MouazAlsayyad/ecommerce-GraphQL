import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class ShoppingMethod {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Float)
  price: number;
}
