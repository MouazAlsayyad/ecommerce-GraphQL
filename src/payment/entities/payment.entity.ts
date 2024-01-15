import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Payment {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;
}
