import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class ItemInput {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  qty: number;
}
