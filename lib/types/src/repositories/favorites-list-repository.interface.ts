import { FavoritesListDTO } from '../dtos/favorites-list-dto.interface';
import { FavoritesListEntity } from '../entities/favorites-list-entity.interface';

export interface FavoritesListRepository {
  addItemToFavoritesList(
    itemToFavoritesListDTO: FavoritesListDTO,
  ): Promise<void>;
  removeItemFromFavoritesList(
    itemToFavoritesListDTO: FavoritesListDTO,
  ): Promise<void>;
  getFavoritesList(userId: number): Promise<FavoritesListEntity[]>;
}
