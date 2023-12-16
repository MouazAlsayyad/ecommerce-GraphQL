import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateBrandInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsString()
  image: string | null;
}

@InputType()
export class AddCategoriesToBrandInput {
  @Field(() => Int)
  @IsNotEmpty()
  brandId: number;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  categories: string[];
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
