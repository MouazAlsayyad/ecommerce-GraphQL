import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCityInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  cityName?: string;
}

@InputType()
export class UpdateStateInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  stateName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  stateCode?: string;
}

@InputType()
export class UpdateCountryInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  countryName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  countryCode?: string;
}
