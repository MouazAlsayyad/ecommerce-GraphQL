import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateOrderStatusInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  status: string;
}
