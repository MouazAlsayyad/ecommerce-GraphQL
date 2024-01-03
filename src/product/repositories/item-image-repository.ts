import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddItemImagesInput } from '../dto/create-product.input';
import { checkImage } from 'src/unit/check-image';

@Injectable()
export class PrismaItemImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addImagesToItem(data: AddItemImagesInput) {
    return this.prisma.$transaction(async (tx) => {
      const itemImages = await Promise.all(
        data.image.map(async (imagePath) => {
          await checkImage(imagePath, tx);
          return { imagePath, productItemId: data.itemId };
        }),
      );
      tx.itemImage.createMany({ data: itemImages });
    });
  }

  getImagesByItemId(productItemId: number) {
    return this.prisma.itemImage.findMany({ where: { productItemId } });
  }

  removeImageFromItem(id: number) {
    this.prisma.itemImage.delete({ where: { id } });
  }
}
