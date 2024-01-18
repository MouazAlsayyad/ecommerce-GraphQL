import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { City, Country, State } from 'src/country/entities/country.entity';

@ObjectType()
export class Address {
  @Field(() => Int)
  id: number;

  @Field()
  address: string;

  @Field()
  postalCode: string;

  @Field(() => Int)
  countryId: number;

  @Field(() => Int)
  stateId: number;

  @Field(() => Int)
  cityId: number;

  @Field({ nullable: true })
  @IsOptional()
  streetNumber?: string;

  @Field(() => Country, { nullable: true })
  @IsOptional()
  country?: Country;

  @Field(() => State, { nullable: true })
  @IsOptional()
  state?: State;

  @Field(() => City, { nullable: true })
  @IsOptional()
  city?: City;
}
