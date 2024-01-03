import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Image } from './image.entity';

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

  @Field(() => [Image], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  ItemImages?: Image[] | null;

  @Field(() => [VariationItem], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationItem)
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
