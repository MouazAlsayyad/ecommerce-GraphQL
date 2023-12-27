import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Brand } from 'src/brand/entities/brand.entity';
import { Category } from 'src/category/entities/category.entity';
import { Review } from 'src/review/entities/review.entity';

@ObjectType()
export class VoidType {}
@ObjectType()
export class Product {
  @Field(() => Int)
  id: number;

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
  coverImage: string;

  @Field(() => Int)
  @IsNotEmpty()
  reviewCount: number;

  @Field()
  @IsNotEmpty()
  averageRating: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image?: string[] | null;

  @Field(() => [Category], { nullable: true })
  @IsOptional()
  @IsArray()
  category?: Category[] | null;

  @Field(() => Brand, { nullable: true })
  @IsOptional()
  brand?: Brand;

  @Field({ defaultValue: true })
  @IsBoolean()
  available: boolean;

  @Field(() => [Attribute], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attribute)
  attributes?: Attribute[] | null;

  @Field(() => [Variation], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Variation)
  variation?: Variation[] | null;

  @Field(() => [ProductItem], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItem)
  productItem?: ProductItem[] | null;

  @Field(() => [Review], { nullable: true })
  userReview?: Omit<Review, 'id'>[];
}

@ObjectType()
export class ProductItem {
  @Field(() => Int)
  id: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  SKU: string;

  @Field(() => Int)
  @IsInt()
  qtyInStock: number;

  @Field()
  @IsInt()
  price: number;

  @Field(() => [VariationItem], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationOption)
  variationsItem?: VariationItem[] | null;
}

@ObjectType()
export class VariationItem {
  @Field()
  @IsString()
  @IsNotEmpty()
  nameVariation: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  valueVariation: string;
}

@ObjectType()
export class Attribute {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;
}

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
