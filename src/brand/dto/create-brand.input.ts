import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EnumOrderBy } from 'src/unit/enum-order-by';

@InputType()
export class CreateBrandInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image: string | null;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  categories?: number[];
}

@InputType()
export class AddCategoriesToBrandInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  brandId: number;

  @Field(() => [Int])
  @IsArray()
  categories: number[];
}

@InputType()
export class BrandOrderBy {
  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(EnumOrderBy)
  name?: EnumOrderBy;
}

@InputType()
export class BrandFilter {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => BrandOrderBy, { nullable: true })
  @IsOptional()
  orderBy?: BrandOrderBy;

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
export class RemoveCategoryFromBrandInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  brandId: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}
