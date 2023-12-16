import { Prisma } from '@prisma/client';

export async function getProductFromFavoritesList(
  productId: number,
  userId: number,
  tx: Prisma.TransactionClient,
) {
  return await tx.favoritesList.findUnique({
    where: { userId_productId: { productId, userId } },
  });
}
