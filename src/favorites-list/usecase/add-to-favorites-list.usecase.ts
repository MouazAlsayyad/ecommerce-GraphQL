import { FavoritesListRepository, UseCase } from 'lib/types/src';
import { FavoritesListInput } from '../dto/create-favorites-list.input';
import { FavoritesList } from '../entities/favorites-list.entity';

export class AddProductToFavoritesListUseCase
  implements UseCase<FavoritesListInput, Promise<FavoritesList[]>>
{
  constructor(private favoritesListRepository: FavoritesListRepository) {}

  async execute(
    data: FavoritesListInput & { userId: number },
  ): Promise<FavoritesList[]> {
    await this.favoritesListRepository.addItemToFavoritesList(data);
    return this.favoritesListRepository.getFavoritesList(data.userId);
  }
}
