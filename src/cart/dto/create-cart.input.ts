import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

@InputType()
export class AddItemCartInput {
  @Field(() => Int)
  @IsNumber()
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
  @IsNumber()
  @IsNotEmpty()
  itemId: number;
}
