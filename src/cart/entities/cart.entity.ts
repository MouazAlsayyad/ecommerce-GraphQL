import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class ProductType {
  @Field()
  id: number;
  @Field()
  name: string;
  @Field()
  coverImage: string;
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
class VariationsItem {
  @Field()
  value: string;
}

@ObjectType()
export class Cart {
  @Field()
  product: ProductType;

  @Field(() => [ItemWithQty])
  item: ItemWithQty[];
}
