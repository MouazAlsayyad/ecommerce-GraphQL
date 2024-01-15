import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsGreaterThanZero', async: false })
export class IsGreaterThanZeroConstraint
  implements ValidatorConstraintInterface
{
  validate(taxRate: number) {
    return taxRate > 0;
  }

  defaultMessage() {
    return 'Tax rate must be greater than 0';
  }
}

@InputType()
export class CreateTaxInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Tax rate must be greater than 0' })
  @Validate(IsGreaterThanZeroConstraint, {
    message: 'Tax rate must be greater than 0',
  })
  taxRate: number;

  @Field(() => Boolean, { defaultValue: true })
  @IsOptional()
  @IsBoolean()
  active: boolean;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  stateCode: string;
}
