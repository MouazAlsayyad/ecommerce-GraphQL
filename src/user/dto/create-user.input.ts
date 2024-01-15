import { InputType, Field, Int } from '@nestjs/graphql';
import { UserType } from '@prisma/client';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

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
export class CreateAddressInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  countryId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  stateId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  cityId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  streetNumber: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  postalCode: string;
}
