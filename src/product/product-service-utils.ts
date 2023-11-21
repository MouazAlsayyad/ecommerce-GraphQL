import { BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomNotFoundException } from 'src/unit/not-found.exception';
import {
  CreateProductAttributeDTO,
  CreateVariationDTO,
} from './dto/create-product.input';
import { CreateProductItemDTO } from './dto/create-product.input';

const logger = new Logger('ProductService');

export async function checkImage(
  path: string,
  prisma: Prisma.TransactionClient,
) {
  const image = await prisma.media.findFirst({
    where: {
      path,
    },
  });
  if (!image) {
    throw new BadRequestException(`The image link is incorrect ${path}`);
  }
}

export async function deleteProductAndRelatedData(
  prisma: Prisma.TransactionClient,
  id: number,
) {
  await prisma.productAttribute.deleteMany({
    where: {
      productId: id,
    },
  });

  await prisma.userReview.deleteMany({
    where: { product: { id } },
  });

  await prisma.productConfiguration.deleteMany({
    where: {
      variation: {
        product: {
          id,
        },
      },
    },
  });

  await prisma.variationOption.deleteMany({
    where: {
      variation: {
        productId: id,
      },
    },
  });

  await prisma.variation.deleteMany({
    where: {
      productId: id,
    },
  });

  await prisma.productItem.deleteMany({
    where: {
      productId: id,
    },
  });

  const product = await prisma.product.delete({
    where: { id: id },
  });

  if (!product) {
    throw new CustomNotFoundException(`Product with ID ${id} not found`);
  }

  return product;
}

// export async function checkCategory(id:number,tx: Prisma.TransactionClient){
//   const category  = await tx.category.findUnique({
//     where:{id}
//   })

//   if (!category)
//     throw new CustomNotFoundException(`Category with ID ${id} not found`);
// }

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
  // console.log(outputArray, variationOptions);
  if (outputArray)
    if (arraysEqual(outputArray, variationOptions)) {
      throw new ConflictException(
        'Item already has variation with these variationOption',
      );
    }
}

export async function createItems(
  productId: number,
  ItemsDTO: CreateProductItemDTO[],
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

            if (!variation)
              throw new ConflictException(
                `not found ${variationItem.nameVariation}`,
              );

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

            if (!variationOption)
              throw new ConflictException(
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
      // let variationsOption;
      // if (itemDTO.variationsItem) {
      //   variationsOption = itemDTO.variationsItem.map((variationOption) => {
      //     return {
      //       value: variationOption.valueVariation,
      //     };
      //   });
      //   checkItemExists(productId, variationsOption, prisma);
      // }
      return item;
    }),
  );
}

export async function createProductConfiguration(
  productItemId: number,
  variationOptionId: number,
  variationId: number,
  prisma: Prisma.TransactionClient,
) {
  const productConfiguration = await prisma.productConfiguration.findUnique({
    where: {
      productItemId_variationId: {
        productItemId,
        variationId,
      },
    },
  });

  if (productConfiguration)
    await prisma.productConfiguration.update({
      where: {
        productItemId_variationId: {
          productItemId,
          variationId,
        },
      },
      data: {
        variationOption: {
          connect: {
            id: variationOptionId,
          },
        },
      },
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

export function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].value !== arr2[i].value) return false;
  }

  return true;
}

export async function updateAndAddItems(
  productId: number,
  ItemsDTO: CreateProductItemDTO[],
  prisma: Prisma.TransactionClient,
) {
  return await Promise.all(
    ItemsDTO.map(async (ItemDTO) => {
      const variationOption = ItemDTO.variationsItem.map((variationItem) => {
        return {
          value: variationItem.valueVariation,
        };
      });

      const item = await prisma.productItem.findFirst({
        where: {
          AND: [
            {
              productId,
            },
            {
              productConfiguration: {
                none: {
                  variationOption: {
                    AND: variationOption,
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

      const outputArray = item?.productConfiguration.map((item) => {
        return { value: item.variationOption.value };
      });

      if (arraysEqual(outputArray, variationOption)) {
        throw new ConflictException(
          'product already has Item with these options',
        );
      }

      if (!item) {
        // await checkImage(ItemDTO.image,prisma)
        const newItem = await createItem(
          productId,
          // ItemDTO.available,
          ItemDTO.price,
          ItemDTO.qtyInStock,
          ItemDTO.SKU,
          // ItemDTO.image,
          prisma,
        );
        await Promise.all(
          ItemDTO.variationsItem.map(async (variationItem) => {
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

            if (!variation)
              throw new ConflictException(
                `not found ${variationItem.nameVariation}`,
              );

            const variationOptions = await prisma.variationOption.findFirst({
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
              select: {
                id: true,
                variationId: true,
              },
            });

            if (!variationOptions)
              throw new ConflictException(
                `not found ${variationItem.valueVariation}`,
              );
            createProductConfiguration(
              newItem.id,
              variationOptions.id,
              variationOptions.variationId,
              prisma,
            );
          }),
        );
        return newItem;
      }
      // await checkImage(varintDTO.image,prisma)
      await prisma.productItem.update({
        where: {
          id: item.id,
        },
        data: {
          // available: ItemDTO.available,
          price: ItemDTO.price,
          qtyInStock: ItemDTO.qtyInStock,
          // image: ItemDTO.image
        },
      });
    }),
  );
}

export async function addVariationsAndVariationOption(
  productId: number,
  variations: CreateVariationDTO[],
  prisma: Prisma.TransactionClient,
) {
  return await Promise.all(
    variations.map(async (variationDto) => {
      let variation = await prisma.variation.findFirst({
        where: {
          AND: [
            {
              name: variationDto.name,
            },
            {
              productId,
            },
          ],
        },
      });

      if (!variation) {
        variation = await createVariation(productId, variationDto.name, prisma);
        await Promise.all(
          variationDto.variationOption.map(async (optionDto) => {
            await createVariationOption(variation.id, optionDto.value, prisma);
          }),
        );
      } else {
        await Promise.all(
          variationDto.variationOption.map(async (optionDto) => {
            const variationOption = await prisma.variationOption.findFirst({
              where: {
                AND: [
                  {
                    variationId: variation.id,
                  },
                  {
                    value: optionDto.value,
                  },
                ],
              },
            });
            if (!variationOption) {
              await createVariationOption(
                variation.id,
                optionDto.value,
                prisma,
              );
            }
          }),
        );
      }
    }),
  );
}

export async function updateProductAttributes(
  productId: number,
  productAttributes: CreateProductAttributeDTO[],
  prisma: Prisma.TransactionClient,
) {
  try {
    await Promise.all(
      productAttributes.map(async (attr) => {
        const productAttribute = await prisma.productAttribute.findFirst({
          where: {
            AND: [
              {
                name: attr.name,
              },
              {
                productId,
              },
            ],
          },
        });

        if (productAttribute) {
          await prisma.productAttribute.update({
            data: {
              value: attr.value,
            },
            where: {
              id: productAttribute.id,
            },
          });
        } else {
          await createAttribute(productId, attr.name, attr.value, prisma);
        }
      }),
    );
  } catch (error) {
    logger.error(error);
    return error;
  }
}

export async function createProductVariations(
  productId: number,
  variations: CreateVariationDTO[],
  tx: Prisma.TransactionClient,
) {
  await Promise.all(
    variations.map(async (variationDto) => {
      const variation = await createVariation(productId, variationDto.name, tx);
      await Promise.all(
        variationDto.variationOption.map(async (optionDto) => {
          if (!optionDto.value) {
            throw new BadRequestException(
              'Required property in variationOption (value) is missing.',
            );
          }
          await createVariationOption(variation.id, optionDto.value, tx);
        }),
      );
    }),
  );
}

export async function createProductAttributes(
  productId: number,
  productAttributes: CreateProductAttributeDTO[],
  prisma: Prisma.TransactionClient,
) {
  await Promise.all(
    productAttributes.map(
      async (attr) =>
        await createAttribute(productId, attr.name, attr.value, prisma),
    ),
  );
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

export async function checkAttributeExisting(
  productId: number,
  name: string,
  prisma: Prisma.TransactionClient,
) {
  const attributeExisting = await prisma.productAttribute.findFirst({
    where: {
      AND: [{ productId }, { name }],
    },
  });

  if (attributeExisting) {
    throw new BadRequestException(
      `The product already has a attribute with this name ${name}`,
    );
  }
}

export async function checkVariationExisting(
  productId: number,
  name: string,
  prisma: Prisma.TransactionClient,
) {
  const variationExisting = await prisma.variation.findFirst({
    where: {
      AND: [{ productId }, { name }],
    },
  });

  if (variationExisting) {
    throw new BadRequestException(
      `The product already has a variation with this name ${name}`,
    );
  }
}

export async function checkVariationOptionExisting(
  variationId: number,
  value: string,
  prisma: Prisma.TransactionClient,
) {
  const variationOptionExisting = await prisma.variationOption.findFirst({
    where: {
      AND: [{ variationId }, { value }],
    },
  });

  if (variationOptionExisting) {
    throw new BadRequestException(
      `The variation already has a variationOption with this name ${value}`,
    );
  }
}

export async function createAttribute(
  productId: number,
  name: string,
  value: string,
  prisma: Prisma.TransactionClient,
) {
  try {
    const productAttribute = await prisma.productAttribute.findFirst({
      where: {
        AND: [
          {
            productId,
          },
          {
            name,
          },
        ],
      },
    });
    if (productAttribute)
      throw new BadRequestException(
        `The product already has this Attribute ${name}`,
      );
    return await prisma.productAttribute.create({
      data: {
        productId,
        name,
        value,
      },
    });
  } catch (error) {
    throw new BadRequestException('Failed to create the product attribute');
  }
}

export async function createVariation(
  productId: number,
  name: string,
  prisma: Prisma.TransactionClient,
) {
  try {
    return await prisma.variation.create({
      data: {
        name,
        productId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new BadRequestException('Failed to create the variation');
  }
}

export async function createVariationOption(
  variationId: number,
  value: string,
  prisma: Prisma.TransactionClient,
) {
  return await prisma.variationOption.create({
    data: {
      value,
      variationId,
    },
  });
}

export function variationsExist(items) {
  return items.some((item, index) => {
    const currentVariations = item.variationsItem;
    for (let i = index + 1; i < items.length; i++) {
      const nextVariations = items[i].variationsItem;
      if (currentVariations.length === nextVariations.length) {
        const match = currentVariations.every(
          (current, idx) =>
            current.nameVariation === nextVariations[idx].nameVariation &&
            current.valueVariation === nextVariations[idx].valueVariation,
        );
        if (match) return true;
      }
    }
    return false;
  });
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
    throw new ConflictException(`Not found ${variationItem.nameVariation}`);
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
    throw new ConflictException(`Not found ${variationItem.valueVariation}`);
  }

  return variationOption;
}

export async function getProductById(
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
    throw new CustomNotFoundException(`Product with ID ${productId} not found`);
  }
  return product;
}
