import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateTagInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  value: string;
}

@InputType()
export class AddTagsToProductInput {
  @Field(() => Int)
  @IsNotEmpty()
  productId: number;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  productTags: string[];
}

@InputType()
export class RemoveTagFromProductInput {
  @Field(() => Int)
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsNotEmpty()
  tagId: number;
}
