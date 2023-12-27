import { Injectable } from '@nestjs/common';
import { FavoritesListInput } from './dto/create-favorites-list.input';
import { PrismaFavoritesListRepository } from './favorites-list-repository';

@Injectable()
export class FavoritesListService {
  constructor(private favoritesListRepository: PrismaFavoritesListRepository) {}

  addProductToFavoritesList(data: FavoritesListInput, userId: number) {
    return this.favoritesListRepository.addItemToFavoritesList(userId, data);
  }
  removeProductFromFavoritesList(data: FavoritesListInput, userId: number) {
    return this.favoritesListRepository.removeItemFromFavoritesList(
      userId,
      data,
    );
  }

  getFavoritesList(userId: number) {
    return this.favoritesListRepository.getFavoritesList(userId);
  }
}
