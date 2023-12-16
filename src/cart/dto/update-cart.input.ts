import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

@InputType()
export class UpdateItemCartInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  qty: number;
}
