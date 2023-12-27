import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';

@ObjectType()
export class FavoritesList {
  @Field(() => Int)
  productId: number;

  @Field(() => Product, { nullable: true })
  @IsOptional()
  product?: Product;
}
