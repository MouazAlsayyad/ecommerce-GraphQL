import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavoritesListInput } from './dto/create-favorites-list.input';
import { FavoritesList } from './entities/favorites-list.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaFavoritesListRepository {
  constructor(private readonly prisma: PrismaService) {}
  addItemToFavoritesList(
    userId: number,
    data: FavoritesListInput,
  ): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      const { productId } = data;

      const itemExist = await this.getProductFromFavoritesList(
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
  removeItemFromFavoritesList(
    userId: number,
    data: FavoritesListInput,
  ): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      const { productId } = data;

      const itemExist = await this.getProductFromFavoritesList(
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
  getFavoritesList(userId: number): Promise<FavoritesList[]> {
    return this.prisma.$transaction(async (tx) => {
      return tx.favoritesList.findMany({ where: { userId } });
    });
  }

  private async getProductFromFavoritesList(
    productId: number,
    userId: number,
    tx: Prisma.TransactionClient,
  ) {
    return await tx.favoritesList.findUnique({
      where: { userId_productId: { productId, userId } },
    });
  }
}
