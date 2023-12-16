import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class CartItem {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  itemId: number;

  @Field(() => Int)
  cartId: number;

  @Field(() => Int)
  qty: number;
}

@ObjectType()
class VariationsItem {
  @Field()
  value: string;
}

@ObjectType()
class ItemWithQty {
  @Field()
  id: number;

  @Field()
  qty: number;

  @Field()
  price: number;

  @Field(() => [VariationsItem])
  variationsItem: VariationsItem[];
}

@ObjectType()
class ProductType {
  @Field(() => Int)
  id: number;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  coverImage: string;
}

@ObjectType()
export class Cart {
  @Field(() => ProductType)
  product: ProductType;

  @Field(() => [ItemWithQty])
  item: ItemWithQty[];
}
