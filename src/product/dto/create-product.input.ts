import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsInt,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  coverImage: string | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image?: string[] | null;

  @Field({ defaultValue: true })
  @IsBoolean()
  available: boolean;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  categoriesIds?: number[] | null;

  @Field({ nullable: true })
  @IsOptional()
  brandId: number;

  @Field(() => [CreateProductAttributeInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeInput)
  attributes?: CreateProductAttributeInput[] | null;

  @Field(() => [CreateVariationInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariationInput)
  variation?: CreateVariationInput[] | null;

  @Field(() => [CreateProductItemInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductItemInput)
  productItem?: CreateProductItemInput[] | null;
}

@InputType()
export class ProductFilterInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  maxPrice?: number;

  @Field({ nullable: true })
  minPrice?: number;
}

@InputType()
export class CreateProductItemInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  SKU: string;

  @Field(() => Int)
  @IsInt()
  qtyInStock: number;

  @Field()
  @IsNumber()
  price: number;

  @Field(() => [CreateVariationItemInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @Type(() => CreateVariationOptionInput)
  variationsItem?: CreateVariationItemInput[] | null;
}

@InputType()
export class CreateVariationItemInput {
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
export class CreateProductAttributeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;
}

@InputType()
export class CreateVariationInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => [CreateVariationOptionInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariationOptionInput)
  variationOption: CreateVariationOptionInput[];
}

@InputType()
export class CreateVariationOptionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;
}
@InputType()
export class AddProductAttributeInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;
}

@InputType()
export class AddVariationOptionInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  variationId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;
}

@InputType()
export class AddProductItemInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  SKU: string;

  @Field(() => Int)
  @IsInt()
  qtyInStock: number;

  @Field()
  @IsNumber()
  price: number;

  @Field(() => [CreateVariationItemInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @Type(() => CreateVariationOptionInput)
  variationsItem?: CreateVariationItemInput[] | null;
}

@InputType()
export class ProductCategoryInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  categoryId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;
}
@InputType()
export class ProductFilterDTO {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  maxPrice?: number;

  @Field({ nullable: true })
  minPrice?: number;

  @Field({ nullable: true })
  categoryId?: number;

  @Field({ nullable: true })
  brand?: string;
}

@InputType()
export class VariationInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => String)
  name: string;

  @Field(() => [AddVariationOptionInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @Type(() => AddVariationOptionInput)
  variationOption?: AddVariationOptionInput[] | null;
}
