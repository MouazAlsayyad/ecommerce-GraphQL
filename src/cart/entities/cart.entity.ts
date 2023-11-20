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
class VariationItem {
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

  @Field(() => [VariationItem])
  variationsItem: VariationItem[];
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

  // @Field(() => Int)
  // qty: number;
}

// @ObjectType()
// class ProductType {
//   @Field(() => Int)
//   id: number;

//   @Field()
//   @IsString()
//   name: string;

//   @Field()
//   @IsString()
//   coverImage: string;
// }

// @ObjectType()
// class Item {
//   @Field()
//   price: number;
// }

// @ObjectType()
// export class Cart {
//   @Field(() => ProductType)
//   product: ProductType;

//   @Field(() => Item)
//   item: Item;

//   @Field(() => Int)
//   qty: number;
// }

// cartItems: {
//   select: {
//     product: {
//       select: {
//         id: true,
//         name: true,
//         coverImage: true,
//       },
//     },
//     item: {
//       select: {
//         price: true,
//         productConfiguration: {
//           select: {
//             variationOption: {
//               select: {
//                 value: true,
//               },
//             },
//           },
//         },
//       },
//     },
//     qty: true,
//   },
// },
