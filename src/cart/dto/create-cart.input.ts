import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

@InputType()
export class AddItemCartInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  qty: number;
}

@InputType()
export class RemoveCartItemInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  itemId: number;
}
