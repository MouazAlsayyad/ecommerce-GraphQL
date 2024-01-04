import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductAttributeInput } from '../dto/create-product.input';
import { Attribute } from '../entities/attribute.entity';
import { UpdateProductAttributeInput } from '../dto/update-product.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaAttributeRepository {
  constructor(private readonly prisma: PrismaService) {}
  getAttributeById(id: number, tx: Prisma.TransactionClient) {
    return tx.productAttribute.findUnique({
      where: { id },
    });
  }

  getAttributesByProductId(productId: number) {
    return this.prisma.productAttribute.findMany({ where: { productId } });
  }

  addAttribute(data: AddProductAttributeInput): Promise<Attribute> {
    return this.prisma.$transaction(async (tx) => {
      const { name, productId, value } = data;
      await this.checkAttributeExist(productId, name, tx);
      return tx.productAttribute.create({
        data: { name, value, productId },
      });
    });
  }

  updateAttribute(data: UpdateProductAttributeInput) {
    return this.prisma.$transaction(async (tx) => {
      const attribute = await this.getAttributeById(data.attributeId, tx);

      if (!attribute || attribute.productId !== data.productId)
        throw new NotFoundException(
          `attribute with ID ${data.attributeId} not found`,
        );
      if (data?.name)
        await this.checkAttributeExist(data.productId, data.name, tx);

      return tx.productAttribute.update({
        where: { id: data.attributeId },
        data: { name: data.name, value: data.value },
      });
    });
  }

  removeAttribute(attributeId: number): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      await tx.productAttribute.delete({
        where: { id: attributeId },
      });
      return true;
    });
  }

  async checkAttributeExist(
    productId: number,
    name: string,
    tx: Prisma.TransactionClient,
  ) {
    const attribute = await tx.productAttribute.findFirst({
      where: { AND: [{ productId }, { name }] },
    });
    if (attribute)
      throw new BadRequestException(
        `The product already has this Attribute ${name}`,
      );
  }
}
