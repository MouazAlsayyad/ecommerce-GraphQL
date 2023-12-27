import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCategoryInput {
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
