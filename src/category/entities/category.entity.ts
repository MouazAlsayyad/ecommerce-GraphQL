import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';

@ObjectType()
export class Category {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  image: string;

  @Field(() => Int, { nullable: true })
  parentId?: number | null;

  @Field(() => [Product])
  product?: Product[];
}
