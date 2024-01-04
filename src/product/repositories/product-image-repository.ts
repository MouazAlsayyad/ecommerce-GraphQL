import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductImagesInput } from '../dto/create-product.input';
import { checkImage } from 'src/unit/check-image';

@Injectable()
export class PrismaProductImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addImagesToProduct(data: AddProductImagesInput) {
    return this.prisma.$transaction(async (tx) => {
      const productImage = await Promise.all(
        data.image.map(async (imagePath) => {
          await checkImage(imagePath, tx);
          return { imagePath, productId: data.productId };
        }),
      );
      return tx.productImage.createMany({ data: productImage });
    });
  }

  getImagesByProductId(productId: number) {
    return this.prisma.productImage.findMany({ where: { productId } });
  }

  async removeImageFromProduct(id: number) {
    await this.prisma.productImage.delete({ where: { id } });
    return true;
  }
}
