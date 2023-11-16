// update-product.input.ts
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

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  // @Field(() => [UpdateProductAttributeDTO], { nullable: true })
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => UpdateProductAttributeDTO)
  // attribute?: UpdateProductAttributeDTO[];

  // @Field(() => [UpdateVariationDTO], { nullable: true })
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => UpdateVariationDTO)
  // variation?: UpdateVariationDTO[];

  // @Field(() => [UpdateProductItemDTO], { nullable: true })
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => UpdateProductItemDTO)
  // productItem?: UpdateProductItemDTO[];
}

@InputType()
export class UpdateProductItemDTO {
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

  @Field(() => [UpdateVariationItemDTO], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariationItemDTO)
  variationsItem?: UpdateVariationItemDTO[] | null;
}

@InputType()
export class UpdateVariationItemDTO {
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
export class UpdateVariationDTO {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  variationId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  // @Field(() => [UpdateVariationOptionDTO], { nullable: true })
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => UpdateVariationOptionDTO)
  // variationOption?: UpdateVariationOptionDTO[];
}

@InputType()
export class UpdateVariationOptionDTO {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  variationOptionId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  variationId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  value?: string;

  // @Field(() => [UpdateProductConfigurationDTO], { nullable: true })
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => UpdateProductConfigurationDTO)
  // productConfiguration?: UpdateProductConfigurationDTO[];
}

@InputType()
export class UpdateProductConfigurationDTO {
  @Field(() => UpdateVariationDTO, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateVariationDTO)
  variation?: UpdateVariationDTO;

  @Field(() => UpdateVariationOptionDTO, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateVariationOptionDTO)
  variationOption?: UpdateVariationOptionDTO;

  @Field(() => UpdateProductItemDTO, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProductItemDTO)
  productItem?: UpdateProductItemDTO;
}

// @InputType()
// export class UpdateProductAttributeInput {
//   @Field(() => Int)
//   @IsInt()
//   @IsNotEmpty()
//   productId: number;

//   @Field(() => Int)
//   @IsInt()
//   @IsNotEmpty()
//   attributeId: number;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   name?: string;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   value?: string;
// }

@InputType()
export class UpdateProductAttributeDTO {
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
