// create-product.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsInt,
  IsNotEmpty,
  ValidateNested,
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
  @IsArray()
  @IsString({ each: true })
  image: string[] | null;

  @Field({ defaultValue: true })
  @IsBoolean()
  available: boolean;

  @Field(() => [CreateProductAttributeDTO], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeDTO)
  attributes?: CreateProductAttributeDTO[] | null;

  @Field(() => [CreateVariationDTO], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariationDTO)
  variation?: CreateVariationDTO[] | null;

  @Field(() => [CreateProductItemDTO], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductItemDTO)
  productItem?: CreateProductItemDTO[] | null;
}

@InputType()
export class ProductFilterDTO {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  maxPrice?: number;

  @Field({ nullable: true })
  minPrice?: number;
}

@InputType()
export class CreateProductItemDTO {
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

  @Field(() => [CreateVariationItemDTO], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariationOptionDTO)
  variationsItem?: CreateVariationItemDTO[] | null;
}

@InputType()
export class CreateVariationItemDTO {
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
export class CreateProductAttributeDTO {
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
export class CreateVariationDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => [CreateVariationOptionDTO])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariationOptionDTO)
  variationOption: CreateVariationOptionDTO[];
}

@InputType()
export class CreateVariationOptionDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class AddProductAttributeDTO {
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
export class AddVariationOptionDTO {
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
export class AddProductItemDTO {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  // @Field(() => Int)
  // @IsInt()
  // @IsNotEmpty()
  // productItemId: number;

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

  @Field(() => [CreateVariationItemDTO], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariationOptionDTO)
  variationsItem?: CreateVariationItemDTO[] | null;
}
