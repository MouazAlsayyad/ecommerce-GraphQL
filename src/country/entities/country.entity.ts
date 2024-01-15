import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class City {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  cityName: string;
}

@ObjectType()
export class State {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  stateName: string;

  @Field(() => String)
  stateCode: string;

  @Field(() => [City], { nullable: true })
  city?: City[];
}

@ObjectType()
export class Country {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  countryName: string;

  @Field(() => String)
  countryCode: string;

  @Field(() => [State], { nullable: true })
  state?: State[];
}
