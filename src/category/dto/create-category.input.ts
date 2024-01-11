import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EnumOrderBy } from 'src/unit/enum-order-by';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image?: string | null;
}

@InputType()
export class CategoryOrderBy {
  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(EnumOrderBy)
  name?: EnumOrderBy;
}

@InputType()
export class CategoryFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  brandId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  categoryName?: string;

  @Field(() => CategoryOrderBy, { nullable: true })
  @IsOptional()
  orderBy?: CategoryOrderBy;

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
