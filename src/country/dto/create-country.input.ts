import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

@InputType()
export class CreateCityInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  cityName: string;
}

@InputType()
export class CreateStateInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  stateName: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  stateCode: string;

  @Field(() => [CreateCityInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCityInput)
  city?: CreateCityInput[] | null;
}

@InputType()
export class CreateCountryInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  countryName: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @Field(() => [CreateStateInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStateInput)
  state?: CreateStateInput[] | null;
}
