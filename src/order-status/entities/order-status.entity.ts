import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class OrderStatus {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  status: string;
}
