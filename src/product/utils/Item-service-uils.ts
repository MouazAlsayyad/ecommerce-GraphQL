import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateVariationItemInput } from 'src/product/dto/create-product.input';

export async function getVariationByProductId(
  prisma: Prisma.TransactionClient,
  productId: number,
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      variation: {
        select: {
          name: true,
        },
      },
    },
  });
  if (!product) {
    throw new NotFoundException(`Product with ID ${productId} not found`);
  }
  return product.variation;
}

export async function createItem(
  productId: number,
  price: number,
  qtyInStock: number,
  SKU: string,
  prisma: Prisma.TransactionClient,
) {
  try {
    return await prisma.productItem.create({
      data: {
        SKU,
        product: {
          connect: {
            id: productId,
          },
        },
        price,
        qtyInStock,
      },
    });
  } catch (error) {
    throw new BadRequestException('Failed to create the Item');
  }
}

export async function checkItemExists(
  productId: number,
  variationOptions: any,
  prisma: Prisma.TransactionClient,
) {
  const existsItem = await prisma.productItem.findFirst({
    where: {
      AND: [
        {
          productId,
        },
        {
          productConfiguration: {
            every: {
              variationOption: {
                OR: variationOptions,
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      productConfiguration: {
        select: {
          variationOption: {
            select: {
              value: true,
            },
          },
        },
      },
    },
  });

  const outputArray = existsItem?.productConfiguration.map((item) => {
    return { value: item.variationOption.value };
  });
  if (outputArray)
    if (arraysEqual(outputArray, variationOptions)) {
      throw new BadRequestException(
        'Item already has variation with these variationOption',
      );
    }
}

export function arraysEqual(arr1: string | any[], arr2: string | any[]) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].value !== arr2[i].value) return false;
  }

  return true;
}

export async function checkVariationOption(
  prisma: Prisma.TransactionClient,
  productId: number,
  variationItem,
) {
  const variation = await prisma.variation.findFirst({
    where: {
      AND: [
        {
          name: variationItem.nameVariation,
        },
        {
          productId,
        },
      ],
    },
  });
  if (!variation) {
    throw new NotFoundException(`Not found ${variationItem.nameVariation}`);
  }

  const variationOption = await prisma.variationOption.findFirst({
    where: {
      AND: [
        {
          value: variationItem.valueVariation,
        },
        {
          variation: {
            productId,
          },
        },
        {
          variationId: variation.id,
        },
      ],
    },
  });
  if (!variationOption) {
    throw new NotFoundException(`Not found ${variationItem.valueVariation}`);
  }

  return variationOption;
}

export async function createProductConfiguration(
  productItemId: number,
  variationOptionId: number,
  variationId: number,
  prisma: Prisma.TransactionClient,
) {
  const productConfiguration = await prisma.productConfiguration.findUnique({
    where: { productItemId_variationId: { productItemId, variationId } },
  });

  if (productConfiguration)
    await prisma.productConfiguration.update({
      where: { productItemId_variationId: { productItemId, variationId } },
      data: { variationOption: { connect: { id: variationOptionId } } },
    });
  else
    await prisma.productConfiguration.create({
      data: {
        variation: { connect: { id: variationId } },

        productItem: { connect: { id: productItemId } },
        variationOption: { connect: { id: variationOptionId } },
      },
    });
}

export async function createVariationsItem(
  itemId: number,
  productId: number,
  variationsItem: CreateVariationItemInput[],
  prisma: Prisma.TransactionClient,
) {
  const variationsOption = variationsItem.map((variationOption) => {
    return { value: variationOption.valueVariation };
  });

  await checkItemExists(productId, variationsOption, prisma);
  await Promise.all(
    variationsItem.map(async (variationItem) => {
      const variationOption = await checkVariationOption(
        prisma,
        productId,
        variationItem,
      );
      await createProductConfiguration(
        itemId,
        variationOption.id,
        variationOption.variationId,
        prisma,
      );
    }),
  );
}

export async function checkProductItemMatch(
  productId: number,
  id: number,
  itemId: number,
): Promise<void> {
  if (id !== productId) {
    throw new NotFoundException(
      `Product with id ${productId} does not have item with id ${itemId}`,
    );
  }
}
