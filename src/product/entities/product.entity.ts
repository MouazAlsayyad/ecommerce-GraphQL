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
import { ProductItem } from './item.entity';
import { Attribute } from './attribute.entity';
import { Variation } from './variation.entity';
import { Image } from './image.entity';
import { Tag } from 'src/tag/entities/tag.entity';

@ObjectType()
export class VoidType {}
@ObjectType()
export class Product {
  @Field(() => Int)
  @IsInt()
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

  @Field(() => [Image], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  productImage?: Image[] | null;

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

  @Field(() => [Tag], { nullable: true })
  productTag?: Tag[];

  @Field(() => [Product], { nullable: true })
  relatedProducts?: Product[];
  //
}
