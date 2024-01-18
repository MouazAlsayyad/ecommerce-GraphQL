import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { Payment } from 'src/payment/entities/payment.entity';
import { ProductItem } from 'src/product/entities/item.entity';
import { Product } from 'src/product/entities/product.entity';
import { ShoppingMethod } from 'src/shopping-method/entities/shopping-method.entity';
import { Tax } from 'src/tax/entities/tax.entity';
import { Address } from 'src/user/entities/address.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class OrderItem {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  orderId: number;

  @Field(() => Int)
  productItemId: number;

  @Field(() => Int)
  qty: number;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  product?: Product;

  @Field({ nullable: true })
  productItem?: ProductItem;
}

@ObjectType()
export class Order {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => Float)
  subTotal: number;

  @Field(() => Float)
  taxes: number;

  @Field(() => Float)
  total: number;

  @Field()
  status: OrderStatus;

  @Field(() => Int)
  addressId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int, { nullable: true })
  taxId?: number;

  @Field(() => Int)
  paymentOptionId: number;

  @Field(() => Tax, { nullable: true })
  tax?: Tax;

  @Field(() => Int, { nullable: true })
  shoppingMethodId?: number;

  @Field(() => ShoppingMethod, { nullable: true })
  shoppingMethod?: ShoppingMethod;

  @Field(() => Payment, { nullable: true })
  paymentOption?: Payment;

  @Field(() => Address, { nullable: true })
  address?: Address;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [OrderItem], { nullable: true })
  orderItem?: OrderItem[];
}
