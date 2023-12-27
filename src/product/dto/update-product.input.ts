import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class UpdateProductInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ each: true })
  brandId?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}

@InputType()
export class UpdateProductItemInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productItemId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  SKU?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  qtyInStock?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  price?: number;

  @Field(() => [UpdateVariationItemInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariationItemInput)
  variationsItem?: UpdateVariationItemInput[] | null;
}

@InputType()
export class UpdateVariationItemInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  nameVariation: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  valueVariation: string;
}

@InputType()
export class UpdateVariationInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  variationId: number;

  @Field({ nullable: true })
  @IsString()
  name: string;
}

@InputType()
export class UpdateVariationOptionInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  variationId: number;

  @Field({ nullable: true })
  @IsString()
  value: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;
}

@InputType()
export class UpdateProductAttributeInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  attributeId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  value?: string;
}
