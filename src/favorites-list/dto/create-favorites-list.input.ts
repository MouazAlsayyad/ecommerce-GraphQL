import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class FavoritesListInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
