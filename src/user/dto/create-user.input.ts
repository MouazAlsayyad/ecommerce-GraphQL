import { InputType, Field, Int } from '@nestjs/graphql';
import { UserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username must not be empty' })
  username: string;

  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @Field()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password must not be empty' })
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    { message: 'Password is too weak' },
  )
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Phone number must not be empty' })
  @IsPhoneNumber()
  phone_number: string;

  @Field()
  @IsEnum(UserType, { message: 'Invalid user type' })
  @IsNotEmpty({ message: 'User type must not be empty' })
  user_type: UserType;
}
@InputType()
export class CreateAddressInput {
  @Field(() => Int)
  @IsInt({ message: 'Country ID must be an integer' })
  @IsNotEmpty({ message: 'Country ID must not be empty' })
  countryId: number;

  @Field(() => Int)
  @IsInt({ message: 'State ID must be an integer' })
  @IsNotEmpty({ message: 'State ID must not be empty' })
  stateId: number;

  @Field(() => Int)
  @IsInt({ message: 'City ID must be an integer' })
  @IsNotEmpty({ message: 'City ID must not be empty' })
  cityId: number;

  @Field()
  @IsString({ message: 'Street number must be a string' })
  @IsNotEmpty({ message: 'Street number must not be empty' })
  streetNumber: string;

  @Field()
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address must not be empty' })
  address: string;

  @Field()
  @IsString({ message: 'Postal code must be a string' })
  @IsNotEmpty({ message: 'Postal code must not be empty' })
  @Length(5, 10, { message: 'Postal code must be between 5 and 10 characters' })
  @IsPostalCode('any', { message: 'Invalid postal code format' })
  postalCode: string;
}
