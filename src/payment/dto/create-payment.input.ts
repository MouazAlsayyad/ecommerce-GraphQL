import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;
}
