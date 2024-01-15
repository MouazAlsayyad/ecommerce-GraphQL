import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Tax {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Float)
  taxRate: number;

  @Field(() => String)
  countryCode: string;

  @Field(() => String)
  stateCode: string;
}
