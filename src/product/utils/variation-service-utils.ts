import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Variation, VariationOption } from '../entities/variation.entity';

export async function createVariation(
  productId: number,
  name: string,
  tx: Prisma.TransactionClient,
): Promise<{ id: number }> {
  return tx.variation.create({
    data: { name, productId },
    select: { id: true },
  });
}

export async function insertVariationOption(
  variationId: number,
  value: string,
): Promise<VariationOption> {
  return this.prisma.$transaction(async (tx) => {
    await checkVariationOptionExist(variationId, value, tx);
    return tx.variationOption.create({
      data: { variationId, value },
    });
  });
}

export async function getVariationById(
  id: number,
  tx: Prisma.TransactionClient,
): Promise<Variation> {
  return tx.variation.findUnique({
    where: { id },
    include: { variationOptions: { select: { id: true, value: true } } },
  });
}

export async function checkVariationExist(
  productId: number,
  name: string,
  tx: Prisma.TransactionClient,
): Promise<void> {
  const variation = await tx.variation.findFirst({
    where: { AND: [{ productId }, { name }] },
  });
  if (variation) {
    throw new BadRequestException(
      `Product with Id ${productId} already has a variation with value ${name}`,
    );
  }
}

export async function checkVariationOptionExist(
  variationId: number,
  value: string,
  tx: Prisma.TransactionClient,
): Promise<void> {
  const variationOption = await tx.variationOption.findFirst({
    where: { AND: [{ variationId }, { value }] },
  });
  if (variationOption) {
    throw new BadRequestException(
      `Variation with Id ${variationId} already has a VariationOption with value ${value}`,
    );
  }
}
