import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import {
  checkAttributeExist,
  createAttribute,
  getAttributeById,
} from '../utils/attribute-service-utils';
import {
  AttributeRepository,
  CreateAttributeDTO,
  ProductAttributeEntity,
  UpdateAttributeDTO,
} from 'lib/types/src';

@Injectable()
export class PrismaAttributeRepository implements AttributeRepository {
  constructor(private readonly prisma: PrismaService) {}
  addAttribute(data: CreateAttributeDTO): Promise<ProductAttributeEntity> {
    return this.prisma.$transaction(async (tx) => {
      return createAttribute(data.productId, data.name, data.value, tx);
    });
  }

  updateAttribute(data: UpdateAttributeDTO) {
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
