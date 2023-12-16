import { Injectable } from '@nestjs/common';
import { FavoritesListInput } from './dto/create-favorites-list.input';
import { PrismaFavoritesListRepository } from 'src/prisma/repositories';
import {
  AddProductToFavoritesListUseCase,
  DeleteProductFromFavoritesListUseCase,
  GetProductFavoritesListUseCase,
} from './usecase';

@Injectable()
export class FavoritesListService {
  constructor(private favoritesListRepository: PrismaFavoritesListRepository) {}

  addProductToFavoritesList(data: FavoritesListInput, userId: number) {
    const addProductToFavoritesListUseCase =
      new AddProductToFavoritesListUseCase(this.favoritesListRepository);
    return addProductToFavoritesListUseCase.execute({ ...data, userId });
  }
  removeProductFromFavoritesList(data: FavoritesListInput, userId: number) {
    const deleteProductFromFavoritesListUseCase =
      new DeleteProductFromFavoritesListUseCase(this.favoritesListRepository);
    return deleteProductFromFavoritesListUseCase.execute({ ...data, userId });
  }

  getFavoritesList(userId: number) {
    const getProductFavoritesListUseCase = new GetProductFavoritesListUseCase(
      this.favoritesListRepository,
    );
    return getProductFavoritesListUseCase.execute(userId);
  }
}
