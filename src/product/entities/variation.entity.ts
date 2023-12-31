import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

@ObjectType()
export class Variation {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => [VariationOption], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationOption)
  variationOptions: VariationOption[];
}

@ObjectType()
export class VariationOption {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;
}
