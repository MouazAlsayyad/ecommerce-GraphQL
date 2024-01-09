import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddItemImagesInput } from '../dto/create-product.input';
import { checkImage } from 'src/unit/check-image';

@Injectable()
export class PrismaItemImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addImagesToItem(data: AddItemImagesInput) {
    return this.prisma.$transaction(async (tx) => {
      const productItem = await tx.productItem.findUnique({
        where: { id: data.itemId },
      });
      if (productItem.productId !== data.productId)
        throw new NotFoundException(
          `product with id ${data.productId} don't have item with id ${data.itemId}`,
        );

      const itemImages = await Promise.all(
        data.image.map(async (imagePath) => {
          await checkImage(imagePath, tx);
          return { imagePath, productItemId: data.itemId };
        }),
      );
      await tx.itemImage.createMany({ data: itemImages });
    });
  }

  getImagesByItemId(productItemId: number) {
    return this.prisma.itemImage.findMany({ where: { productItemId } });
  }

  async removeImageFromItem(id: number, productId: number) {
    const productItem = await this.prisma.productItem.findUnique({
      where: { id },
    });
    if (productItem.productId !== productId)
      throw new NotFoundException(
        `product with id ${productId} don't have item with id ${id}`,
      );
    await this.prisma.itemImage.delete({ where: { id } });
    return true;
  }
}
