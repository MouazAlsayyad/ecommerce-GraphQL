import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

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
  @IsArray()
  @IsString({ each: true })
  image: string[] | null;

  @Field({ defaultValue: true })
  @IsBoolean()
  available: boolean;

  @Field(() => [Attribute], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attribute)
  attributes: Attribute[] | null;

  @Field(() => [Variation], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Variation)
  variation: Variation[] | null;

  @Field(() => [ProductItem], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItem)
  productItem: ProductItem[] | null;
}

@ObjectType()
export class ProductItem {
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
  variationsItem: VariationItem[] | null;
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
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => [VariationOption])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationOption)
  variationOption: VariationOption[];
}

@ObjectType()
export class VariationOption {
  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;
}
