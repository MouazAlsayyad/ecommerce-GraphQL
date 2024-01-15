import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { IsGreaterThanZeroConstraint } from './create-tax.input';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTaxInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Tax rate must be greater than 0' })
  @Validate(IsGreaterThanZeroConstraint, {
    message: 'Tax rate must be greater than 0',
  })
  taxRate?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  stateCode?: string;
}
