import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FavoritesListEntity,
  FavoritesListRepository,
  FavoritesListDTO,
} from 'lib/types/src';
import { PrismaService } from '../prisma.service';
import { getProductFromFavoritesList } from '../utils/favorites-list-service-utils';

@Injectable()
export class PrismaFavoritesListRepository implements FavoritesListRepository {
  constructor(private readonly prisma: PrismaService) {}
  addItemToFavoritesList(data: FavoritesListDTO): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      const { productId, userId } = data;
      console.log(data);
      const itemExist = await getProductFromFavoritesList(
        productId,
        userId,
        tx,
      );

      if (itemExist)
        throw new BadRequestException(
          `The product with Id ${productId} is already in your favorites list`,
        );

      await tx.favoritesList.create({ data: { productId, userId } });
      return;
    });
  }
  removeItemFromFavoritesList(data: FavoritesListDTO): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      const { productId, userId } = data;

      const itemExist = await getProductFromFavoritesList(
        productId,
        userId,
        tx,
      );

      if (!itemExist)
        throw new NotFoundException(`product with ID ${productId} not found`);

      await tx.favoritesList.delete({
        where: { userId_productId: { productId, userId } },
      });
      return;
    });
  }
  getFavoritesList(userId: number): Promise<FavoritesListEntity[]> {
    return this.prisma.$transaction(async (tx) => {
      const favoritesList = await tx.favoritesList.findMany({
        where: {
          userId,
        },
        select: {
          product: {
            select: {
              id: true,
              name: true,
              coverImage: true,
              available: true,
            },
          },
        },
      });

      const result = favoritesList.map((pro) => {
        return {
          id: pro.product.id,
          name: pro.product.name,
          coverImage: pro.product.coverImage,
          available: pro.product.available,
        };
      });

      return result;
    });
  }
}
