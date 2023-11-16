import { InputType, Field, Int } from '@nestjs/graphql';
import { UserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @Field()
  @IsEnum(UserType)
  @IsNotEmpty()
  user_type: UserType;
}

@InputType()
export class AddressDTO {
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

@InputType()
export class CountryDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  country_name: string;
}
