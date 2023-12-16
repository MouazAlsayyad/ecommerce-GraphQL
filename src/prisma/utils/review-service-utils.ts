import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export async function updateProductReviewInfo(
  productId: number,
  tx: Prisma.TransactionClient,
) {
  const reviews = await tx.userReview.findMany({
    where: { productId },
  });

  const reviewCount = reviews.length;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

  const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

  await tx.product.update({
    where: { id: productId },
    data: {
      averageRating,
      reviewCount,
    },
  });
}

export async function checkProductExixt(
  id: number,
  tx: Prisma.TransactionClient,
) {
  const product = await tx.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
}
