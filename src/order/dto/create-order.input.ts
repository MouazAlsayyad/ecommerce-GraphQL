import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  // IsPhoneNumber,
  IsString,
} from 'class-validator';
import { CreateAddressInput } from 'src/user/dto/create-user.input';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

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

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  addressId?: number;

  @Field(() => CreateAddressInput, { nullable: true })
  @IsOptional()
  shippingAddress?: CreateAddressInput;
}
