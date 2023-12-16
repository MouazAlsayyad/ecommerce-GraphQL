import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductAttributeEntity } from 'lib/types/src/entities/attribute-entity.interface';

export async function createAttribute(
  productId: number,
  name: string,
  value: string,
  tx: Prisma.TransactionClient,
): Promise<ProductAttributeEntity> {
  const productAttribute = await getAttributeByName(productId, name, tx);
  if (productAttribute)
    throw new BadRequestException(
      `The product already has this Attribute ${name}`,
    );
  return tx.productAttribute.create({ data: { productId, name, value } });
}

export async function checkAttributeExist(
  productId: number,
  name: string,
  tx: Prisma.TransactionClient,
) {
  if (await getAttributeByName(productId, name, tx))
    throw new BadRequestException(
      `The product already has this Attribute ${name}`,
    );
}

export function getAttributeByName(
  productId: number,
  name: string,
  tx: Prisma.TransactionClient,
): Promise<ProductAttributeEntity> {
  return tx.productAttribute.findFirst({
    where: { AND: [{ productId }, { name }] },
  });
}

export function getAttributeById(id: number, tx: Prisma.TransactionClient) {
  return tx.productAttribute.findUnique({
    where: { id },
  });
}
