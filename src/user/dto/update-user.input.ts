import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAddressInput {
  @Field(() => Int)
  @IsNotEmpty()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  countryId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  region?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  stateId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  cityId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  streetNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  postalCode?: string;
}

@InputType()
export class RemoveAddressInput {
  @Field(() => Int)
  @IsNotEmpty()
  addressId: number;
}
