import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
@ObjectType()
export class AuthUser {
  @Expose()
  @Field(() => Int)
  id: number;

  @Expose()
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Expose()
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @Field()
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @Expose()
  @Field()
  @IsEnum(UserType)
  @IsNotEmpty()
  user_type: UserType;
}

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  token: string;
}
