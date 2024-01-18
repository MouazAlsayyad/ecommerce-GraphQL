import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserType } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Address } from './address.entity';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

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
  phone_number: string;

  @Field()
  @IsEnum(UserType)
  @IsNotEmpty()
  user_type: UserType;

  @Field(() => [Address], { nullable: true })
  address?: Address[];

  @Field(() => Boolean)
  isBlock?: boolean;
}

@ObjectType()
export class VoidType {}
