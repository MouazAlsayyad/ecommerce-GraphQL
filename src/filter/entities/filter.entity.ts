import { ObjectType, Field } from '@nestjs/graphql';
import { Brand } from 'src/brand/entities/brand.entity';
import { Category } from 'src/category/entities/category.entity';

@ObjectType()
export class VariationFilter {
  @Field()
  name: string;
  @Field(() => [VariationOptionFilter])
  variationOptionFilter?: VariationOptionFilter[];
}

@ObjectType()
export class VariationOptionFilter {
  @Field()
  value?: string;
}

@ObjectType()
export class Filter {
  @Field({ nullable: true })
  minPrice?: number;

  @Field({ nullable: true })
  maxPrice?: number;

  @Field(() => [Category], { nullable: true })
  category?: Category[];

  @Field(() => [Brand], { nullable: true })
  brand?: Brand[];

  @Field(() => [VariationFilter], { nullable: true })
  variationFilter?: VariationFilter[];
}
