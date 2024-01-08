import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
export class CategoryFilterInput {
  @Field({ nullable: true })
  brandId?: number;

  @Field({ nullable: true })
  categoryName?: string;
}

export class CategoryFilterDTO {
  name: {
    contains: string;
  };
  brand_category: {
    some: {
      brandId: number;
    };
  };
}
