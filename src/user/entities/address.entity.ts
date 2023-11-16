import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ObjectType()
export class Address {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  countryId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  street_number: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  region: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  postal_code: string;
}

@ObjectType()
export class Country {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  country_name: string;
}
