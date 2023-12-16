import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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
  street_number?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  region?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  postal_code?: string;
}

@InputType()
export class RemoveAddressInput {
  @Field(() => Int)
  @IsNotEmpty()
  addressId: number;
}
