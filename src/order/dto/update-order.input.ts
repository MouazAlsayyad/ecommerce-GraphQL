import { InputType, Field, Int } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsNotIn } from 'class-validator';

@InputType()
export class UpdateOrderInput {
  @Field(() => Int)
  id: number;

  @Field()
  @IsEnum(OrderStatus)
  @IsNotIn(['CANCELED'], { message: 'Invalid order status' })
  status: OrderStatus;
}
