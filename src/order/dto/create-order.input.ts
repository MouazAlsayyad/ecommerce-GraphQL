import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  paymentOptionId: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  shoppingMethodId: number;
}

// id                    Int             @id @default(autoincrement())
//   name                  String
//   shippingAddress       String
//   email                 String
//   phone                 String
//   subTotal              Float
//   total                 Float
//   userId                Int
//   user                  User             @relation(fields: [userId], references: [id])
//   paymentOptionId       Int
//   paymentOption         PaymentOption    @relation(fields: [paymentOptionId], references: [id])
//   orderTax              OrderTax[]
//   statusId              Int
//   status                OrderStatus      @relation(fields: [statusId], references: [id])
//   shoppingMethodId      Int
//   shoppingMethod        ShoppingMethod   @relation(fields: [shoppingMethodId], references: [id])
//   orderItem             OrderItem[]
//   createdAt             DateTime         @default(now())
//   updatedAt             DateTime         @updatedAt @default(now())
