import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}

@InputType()
export class AddCategoriesToBrandInput {
  @Field(() => Int)
  @IsNotEmpty()
  brandId: number;

  @Field(() => [Int])
  @IsArray()
  categories: number[];
}

@InputType()
export class RemoveCategoryFromBrandInput {
  @Field(() => Int)
  @IsNotEmpty()
  brandId: number;

  @Field(() => Int)
  @IsString()
  @IsNotEmpty()
  categoryId: number;
}
