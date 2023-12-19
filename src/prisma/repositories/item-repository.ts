import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateProductItemDTO,
  ProductItemEntity,
  UpdateProductItemDTO,
} from 'lib/types/src';
import { PrismaService } from '../prisma.service';

import {
  checkProductItemMatch,
  createItem,
  createVariationsItem,
  getVariationByProductId,
} from '../utils/Item-service-uils';
import { checkVariationsItemLength } from '../utils/product-service-uils';
@Injectable()
export class PrismaProductItemRepository {
  constructor(private readonly prisma: PrismaService) {}
  addProductItem(data: CreateProductItemDTO): Promise<ProductItemEntity> {
    return this.prisma.$transaction(async (prisma) => {
      const variation = await getVariationByProductId(prisma, data.productId);

      const item = await createItem(
        data.productId,
        data.price,
        data.qtyInStock,
        data.SKU,
        prisma,
      );

      if (data?.variationsItem) {
        checkVariationsItemLength(data.variationsItem.length, variation.length);
        await createVariationsItem(
          item.id,
          data.productId,
          data.variationsItem,
          prisma,
        );
      }

      return item;
    });
  }

  updateProductItem(data: UpdateProductItemDTO): Promise<ProductItemEntity> {
    return this.prisma.$transaction(async (prisma) => {
      const variation = await getVariationByProductId(prisma, data.productId);

      const item = await prisma.productItem.update({
        where: { id: data.productItemId },
        data: {
          price: data.price,
          qtyInStock: data.qtyInStock,
          SKU: data.SKU,
        },
      });

      checkProductItemMatch(data.productId, item.productId, data.productItemId);

      if (data?.variationsItem) {
        checkVariationsItemLength(data.variationsItem.length, variation.length);
        await createVariationsItem(
          item.id,
          data.productId,
          data.variationsItem,
          prisma,
        );
      }
      return item;
    });
  }

  deleteProductItem(id: number): Promise<number> {
    return this.prisma.$transaction(async (prisma) => {
      const productItem = await prisma.productItem.findUnique({
        where: { id },
      });

      if (!productItem)
        throw new NotFoundException(`productItem with ID ${id} not found`);

      await prisma.productConfiguration.deleteMany({
        where: { productItemId: id },
      });

      await prisma.productItem.delete({
        where: { id },
      });

      return productItem.productId;
    });
  }
}
