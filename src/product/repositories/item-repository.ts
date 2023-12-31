import { Injectable, NotFoundException } from '@nestjs/common';

import {
  checkProductItemMatch,
  createItem,
  createVariationsItem,
  getVariationByProductId,
} from '../utils/Item-service-uils';
import { checkVariationsItemLength } from '../utils/product-service-utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductItemInput } from '../dto/create-product.input';
import { ProductItem } from '../entities/item.entity';
import { UpdateProductItemInput } from '../dto/update-product.input';
@Injectable()
export class PrismaProductItemRepository {
  constructor(private readonly prisma: PrismaService) {}
  addProductItem(data: AddProductItemInput): Promise<ProductItem> {
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

  updateProductItem(data: UpdateProductItemInput): Promise<ProductItem> {
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

  async getProductItemsByProductId(productId: number): Promise<ProductItem[]> {
    const productItem = await this.prisma.productItem.findMany({
      where: { productId },
      include: {
        productConfiguration: {
          include: { variation: true, variationOption: true },
        },
      },
    });
    const result = productItem.map((productItem) => {
      const productConfiguration = productItem.productConfiguration;

      const variationsItem = productConfiguration.map((item) => ({
        nameVariation: item.variation.name,
        valueVariation: item.variationOption.value,
      }));

      return {
        ...productItem,
        variationsItem,
      };
    });

    return result;
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
