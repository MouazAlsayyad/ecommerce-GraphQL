import { FavoritesListRepository, UseCase } from 'lib/types/src';
import { FavoritesList } from '../entities/favorites-list.entity';

export class GetProductFavoritesListUseCase
  implements UseCase<number, Promise<FavoritesList[]>>
{
  constructor(private favoritesListRepository: FavoritesListRepository) {}

  async execute(userId: number): Promise<FavoritesList[]> {
    return await this.favoritesListRepository.getFavoritesList(userId);
  }
}
