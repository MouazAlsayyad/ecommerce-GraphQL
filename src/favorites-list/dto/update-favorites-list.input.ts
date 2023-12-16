import { FavoritesListInput } from './create-favorites-list.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFavoritesListInput extends PartialType(FavoritesListInput) {
  @Field(() => Int)
  id: number;
}
