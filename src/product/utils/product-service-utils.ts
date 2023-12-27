import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateProductAttributeInput,
  CreateProductItemInput,
  CreateVariationInput,
} from 'src/product/dto/create-product.input';
import { createAttribute } from './attribute-service-utils';

import {
  checkVariationOptionExist,
  createVariation,
} from './variation-service-utils';
import { createItem, createProductConfiguration } from './Item-service-uils';
import { Product } from '../entities/product.entity';

export async function checkVariationsItemLength(
  variationsItemLength: number,
  productVariationLength: number,
) {
  if (variationsItemLength !== productVariationLength)
    throw new BadRequestException(`The item is missing some variation`);
}

export async function createProductAttributes(
  productId: number,
  productAttributes: CreateProductAttributeInput[],
  prisma: Prisma.TransactionClient,
) {
  await Promise.all(
    productAttributes.map(
      async (attr) =>
        await createAttribute(productId, attr.name, attr.value, prisma),
    ),
  );
}

export async function mapProductWithVariations(product): Promise<Product> {
  const Product = {
    ...product,
    productItem: product.productItem.map((productItem) => {
      const productConfiguration = productItem.productConfiguration;

      const variationsItem = productConfiguration.map((item) => ({
        nameVariation: item.variation.name,
        valueVariation: item.variationOption.value,
      }));

      return {
        ...productItem,
        variationsItem,
      };
    }),
  };

  return Product;
}

export async function createProductVariations(
  productId: number,
  variations: CreateVariationInput[],
  tx: Prisma.TransactionClient,
) {
  await Promise.all(
    variations.map(async (variationDto) => {
      const variation = await createVariation(productId, variationDto.name, tx);
      const data = await Promise.all(
        variationDto.variationOption.map(async (optionDto) => {
          await checkVariationOptionExist(variation.id, optionDto.value, tx);
          return {
            variationId: variation.id,
            value: optionDto.value,
          };
        }),
      );
      await tx.variationOption.createMany({ data });
    }),
  );
}

// export async function variationsExist(
//   items: CreateProductItemInput[],
// ): Promise<boolean> {
//   return items.some((item, index) => {
//     const currentVariations = item.variationsItem;
//     for (let i = index + 1; i < items.length; i++) {
//       const nextVariations = items[i].variationsItem;
//       if (currentVariations.length === nextVariations.length) {
//         const match = currentVariations.every(
//           (current, idx) =>
//             current.nameVariation === nextVariations[idx].nameVariation &&
//             current.valueVariation === nextVariations[idx].valueVariation,
//         );
//         if (match) return true;
//       }
//     }
//     return false;
//   });
// }

export async function createItems(
  productId: number,
  ItemsDTO: CreateProductItemInput[],
  prisma: Prisma.TransactionClient,
) {
  return Promise.all(
    ItemsDTO.map(async (itemDTO) => {
      const item = await createItem(
        productId,
        itemDTO.price,
        itemDTO.qtyInStock,
        itemDTO.SKU,
        prisma,
      );

      if (itemDTO?.variationsItem) {
        await Promise.all(
          itemDTO.variationsItem.map(async (variationItem) => {
            const variation = await prisma.variation.findFirst({
              where: {
                AND: [{ name: variationItem.nameVariation }, { productId }],
              },
            });

            if (!variation)
              throw new NotFoundException(
                `not found ${variationItem.nameVariation}`,
              );

            const variationOption = await prisma.variationOption.findFirst({
              where: {
                AND: [
                  { value: variationItem.valueVariation },
                  { variation: { productId } },
                  { variationId: variation.id },
                ],
              },
            });

            if (!variationOption)
              throw new NotFoundException(
                `not found ${variationItem.valueVariation}`,
              );

            await createProductConfiguration(
              item.id,
              variationOption.id,
              variationOption.variationId,
              prisma,
            );
          }),
        );
      }
      return item;
    }),
  );
}

export async function deleteProductAndRelatedData(
  prisma: Prisma.TransactionClient,
  productId: number,
) {
  await prisma.productAttribute.deleteMany({ where: { productId } });

  await prisma.userReview.deleteMany({ where: { product: { id: productId } } });

  await prisma.productConfiguration.deleteMany({
    where: { variation: { product: { id: productId } } },
  });

  await prisma.variationOption.deleteMany({
    where: { variation: { productId } },
  });

  await prisma.variation.deleteMany({ where: { productId } });

  await prisma.productItem.deleteMany({ where: { productId } });

  await prisma.product_Category.deleteMany({ where: { productId } });

  const product = await prisma.product.delete({ where: { id: productId } });

  if (!product) {
    throw new NotFoundException(`Product with ID ${productId} not found`);
  }

  return product;
}
