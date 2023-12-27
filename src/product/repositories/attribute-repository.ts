import { Injectable, NotFoundException } from '@nestjs/common';

import {
  checkAttributeExist,
  createAttribute,
  getAttributeById,
} from '../utils/attribute-service-utils';

import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductAttributeInput, } from '../dto/create-product.input';
import { Attribute } from '../entities/product.entity';
import { UpdateProductAttributeInput } from '../dto/update-product.input';

@Injectable()
export class PrismaAttributeRepository {
  constructor(private readonly prisma: PrismaService) {}
  getAttributesByProductId(productId: number) {
    return this.prisma.productAttribute.findMany({ where: { productId } });
  }
  addAttribute(data: AddProductAttributeInput): Promise<Attribute> {
    return this.prisma.$transaction(async (tx) => {
      return createAttribute(data.productId, data.name, data.value, tx);
    });
  }

  updateAttribute(data: UpdateProductAttributeInput) {
    return this.prisma.$transaction(async (tx) => {
      const attribute = await getAttributeById(data.attributeId, tx);

      if (!attribute || attribute.productId !== data.productId)
        throw new NotFoundException(
          `attribute with ID ${data.attributeId} not found`,
        );

      await checkAttributeExist(data.productId, data.name, tx);

      return tx.productAttribute.update({
        where: { id: data.attributeId },
        data: { name: data.name, value: data.value },
      });
    });
  }

  removeAttribute(attributeId: number): Promise<number> {
    return this.prisma.$transaction(async (tx) => {
      const { productId } = await tx.productAttribute.delete({
        where: { id: attributeId },
      });
      return productId;
    });
  }
}
