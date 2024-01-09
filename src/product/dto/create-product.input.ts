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
  Min,
  Max,
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

  @Field()
  @IsString()
  @IsNotEmpty()
  coverImage: string | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image?: string[] | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productTag?: string[] | null;

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
export class AddProductImagesInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  image: string[];
}

@InputType()
export class AddItemImagesInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  image: string[];
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
export class RemoveItemInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  itemId: number;
}

@InputType()
export class RemoveAttributeInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  attributeId: number;
}

@InputType()
export class RemoveItemImageInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  ItemImageId: number;
}

@InputType()
export class RemoveProductImageInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productImageId: number;
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
export class FilterDTO {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  variationOptions?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  averageRating?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  brandId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsString()
  brand?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;
}
@InputType()
export class ProductFilterDTO {
  @Field(() => FilterDTO, { nullable: true })
  @IsOptional()
  @Type(() => FilterDTO)
  filter?: FilterDTO;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number;
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
