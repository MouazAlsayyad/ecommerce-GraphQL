import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  AddProductAttributeDTO,
  AddProductItemDTO,
  AddVariationOptionDTO,
  CreateProductInput,
  ProductFilterDTO,
} from './dto/create-product.input';
import {
  UpdateProductAttributeDTO,
  UpdateProductInput,
  UpdateProductItemDTO,
  UpdateVariationDTO,
  UpdateVariationOptionDTO,
} from './dto/update-product.input';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  checkAttributeExisting,
  checkItemExists,
  checkVariationExisting,
  checkVariationOption,
  checkVariationOptionExisting,
  createAttribute,
  createItem,
  createItems,
  createProductAttributes,
  createProductConfiguration,
  createProductVariations,
  createVariationOption,
  deleteProductAndRelatedData,
  getProductById,
  variationsExist,
} from './product-service-utils';
import { CustomNotFoundException } from 'src/unit/not-found.exception';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(ProductService.name);

  create(createProductInput: CreateProductInput) {
    return this.prisma.$transaction(async (tx) => {
      await this.checkBrand(createProductInput.brandId, tx);
      const category = await this.checkCategory(
        createProductInput.category,
        tx,
      );
      const product = await tx.product.create({
        data: {
          name: createProductInput.name,
          coverImage: createProductInput.coverImage,
          description: createProductInput.description,
          available: createProductInput.available,
        },
      });
      await tx.product_Category.create({
        data: {
          categoryId: category.id,
          productId: product.id,
        },
      });
      if (createProductInput.attributes)
        await createProductAttributes(
          product.id,
          createProductInput.attributes,
          tx,
        );
      if (createProductInput.variation) {
        await createProductVariations(
          product.id,
          createProductInput.variation,
          tx,
        );
      }

      if (createProductInput.variation && createProductInput.productItem) {
        // await Promise.all(createProductInput.productItem.map(async productItem=>{
        //   await checkImage(productItem.image,tx)
        // }))
        if (variationsExist(createProductInput.productItem))
          throw new BadRequestException(
            `There is a repetition of variationsItem`,
          );
        createProductInput.productItem.map((item) => {
          if (
            item.variationsItem.length !== createProductInput.variation.length
          )
            throw new BadRequestException(`The item is missing some variation`);
        });
        await createItems(product.id, createProductInput.productItem, tx);
      }

      return tx.product.findUnique({
        where: { id: product.id },
        select: {
          id: true,
          name: true,
          coverImage: true,
          description: true,
          available: true,
          attributes: {
            select: {
              name: true,
              value: true,
            },
          },
        },
      });
    });
  }

  checkCategory(categoryName: string, tx: Prisma.TransactionClient) {
    const categoryExist = tx.category.findFirst({
      where: { name: categoryName },
    });
    if (!categoryExist)
      throw new NotFoundException(
        `category with name ${categoryName} not found`,
      );
    return categoryExist;
  }

  async checkBrand(id: number, tx: Prisma.TransactionClient) {
    const brand = await tx.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException(`brand with Id ${id} not found`);
    return brand;
  }

  findAll(filters: ProductFilterDTO) {
    return this.prisma.$transaction(async (tx) => {
      const price =
        filters?.minPrice || filters?.maxPrice
          ? {
              ...(filters?.minPrice && {
                gte: parseFloat(filters.minPrice.toString()),
              }),
              ...(filters?.maxPrice && {
                lte: parseFloat(filters.maxPrice.toString()),
              }),
            }
          : undefined;

      delete filters?.minPrice;
      delete filters?.maxPrice;

      const filter = {
        ...(filters?.name && { name: filters.name }),
        ...(price && { productItem: { some: { price } } }),
      };

      return tx.product.findMany({
        where: filter,
        select: {
          available: true,
          coverImage: true,
          id: true,
          description: true,
          name: true,
          image: true,
          attributes: {
            select: {
              name: true,
              value: true,
            },
          },
        },
      });
    });
  }

  findOne(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id },
        select: {
          id: true,
          available: true,
          description: true,
          name: true,
          coverImage: true,
          image: true,
          reviewCount: true,
          averageRating: true,
          attributes: {
            select: {
              name: true,
              value: true,
            },
          },
          variation: {
            select: {
              id: true,
              name: true,
              variationOptions: {
                select: {
                  value: true,
                },
              },
            },
          },
          productItem: {
            select: {
              id: true,
              price: true,
              qtyInStock: true,
              SKU: true,
              productConfiguration: {
                select: {
                  variation: {
                    select: {
                      name: true,
                    },
                  },
                  variationOption: {
                    select: {
                      value: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!product)
        throw new CustomNotFoundException(`Product with ID ${id} not found`);

      const productWithVariations = {
        ...product,
        productItem: product.productItem.map((productItem) => {
          const productConfiguration = productItem.productConfiguration;

          const variationsItem = productConfiguration.map((item) => ({
            nameVariation: item.variation.name,
            valueVariation: item.variationOption.value,
          }));

          return {
            ...productItem,
            variationsItem: variationsItem,
          };
        }),
      };
      this.logger.log(productWithVariations.averageRating);
      return productWithVariations;
    });
  }

  update(id: number, updateProductInput: UpdateProductInput) {
    try {
      return this.prisma.$transaction(async (tx) => {
        return await tx.product.update({
          where: { id },
          data: {
            name: updateProductInput.name,
            available: updateProductInput.available,
            description: updateProductInput.description,
            coverImage: updateProductInput.coverImage,
          },
        });
      });
    } catch (error) {}

    return `This action updates a #${updateProductInput} product`;
  }

  removeProduct(id: number) {
    return this.prisma.$transaction(async (tx) => {
      await this.findOne(id);
      try {
        return await deleteProductAndRelatedData(tx, id);
      } catch (error) {
        this.logger.error(error);
        return error;
      }
    });
  }

  async addAttribute(
    productId: number,
    addProductAttributeDTO: AddProductAttributeDTO,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      return createAttribute(
        productId,
        addProductAttributeDTO.name,
        addProductAttributeDTO.value,
        prisma,
      );
    });
  }

  async updateAttribute(
    productId: number,
    id: number,
    updateAttributeDTO: UpdateProductAttributeDTO,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const attribute = await prisma.productAttribute.findUnique({
        where: { id },
      });

      if (!attribute || attribute.productId !== productId)
        throw new CustomNotFoundException(`attribute with ID ${id} not found`);

      if (updateAttributeDTO?.name)
        await checkAttributeExisting(
          productId,
          updateAttributeDTO.name,
          prisma,
        );

      return await prisma.productAttribute.update({
        where: {
          id,
        },
        data: {
          name: updateAttributeDTO.name,
          value: updateAttributeDTO.value,
        },
      });
    });
  }

  removeAttribute(id: number) {
    return this.prisma.$transaction(async (prisma) => {
      const attribute = await prisma.productAttribute.findUnique({
        where: { id },
      });

      if (!attribute)
        throw new CustomNotFoundException(`attribute with ID ${id} not found`);

      return await prisma.productAttribute.delete({
        where: { id },
      });
    });
  }

  updateVariation(
    productId: number,
    id: number,
    updateVariationDTO: UpdateVariationDTO,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const variation = await prisma.variation.findUnique({
        where: { id },
      });

      if (!variation || variation.productId !== productId)
        throw new CustomNotFoundException(`variation with ID ${id} not found`);

      await checkVariationExisting(productId, updateVariationDTO.name, prisma);

      return await prisma.variation.update({
        where: {
          id,
        },
        data: {
          name: updateVariationDTO.name,
        },
      });
    });
  }

  addVariationOption(
    variationId: number,
    addVariationOptionDTO: AddVariationOptionDTO,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      await checkVariationOptionExisting(
        variationId,
        addVariationOptionDTO.value,
        prisma,
      );

      return createVariationOption(
        variationId,
        addVariationOptionDTO.value,
        prisma,
      );
    });
  }

  updateVariationOption(
    variationId: number,
    id: number,
    updateVariationOptionDTO: UpdateVariationOptionDTO,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const variationOption = await prisma.variationOption.findUnique({
        where: { id },
      });

      if (!variationOption || variationOption.variationId !== variationId)
        throw new CustomNotFoundException(
          `variationOption with ID ${id} not found`,
        );

      await checkVariationOptionExisting(
        variationId,
        updateVariationOptionDTO.value,
        prisma,
      );

      return await prisma.variationOption.update({
        where: {
          id,
        },
        data: {
          value: updateVariationOptionDTO.value,
        },
      });
    });
  }

  updateProductItem(
    productId: number,
    productItemId: number,
    updateProductItemDTO: UpdateProductItemDTO,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const product = await getProductById(prisma, productId);

      if (
        updateProductItemDTO.variationsItem.length !== product.variation.length
      ) {
        throw new BadRequestException(`The item is missing some variation`);
      }

      const item = await prisma.productItem.update({
        where: { id: productItemId },
        data: {
          price: updateProductItemDTO.price,
          qtyInStock: updateProductItemDTO.qtyInStock,
          SKU: updateProductItemDTO.SKU,
        },
      });

      if (item.productId !== productId)
        throw new ConflictException(
          `product with id ${productId} does not have item with id ${productItemId}`,
        );

      if (updateProductItemDTO?.variationsItem) {
        const variationsOption = updateProductItemDTO.variationsItem.map(
          (variationOption) => {
            return { value: variationOption.valueVariation };
          },
        );

        await checkItemExists(productId, variationsOption, prisma);

        await Promise.all(
          updateProductItemDTO.variationsItem.map(async (variationItem) => {
            const variationOption = await checkVariationOption(
              prisma,
              productId,
              variationItem,
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
    });
  }

  addProductItem(productId: number, addProductItemInput: AddProductItemDTO) {
    return this.prisma.$transaction(async (prisma) => {
      const product = await getProductById(prisma, productId);

      const item = await createItem(
        productId,
        addProductItemInput.price,
        addProductItemInput.qtyInStock,
        addProductItemInput.SKU,
        prisma,
      );

      if (addProductItemInput?.variationsItem) {
        if (
          addProductItemInput.variationsItem.length !== product.variation.length
        )
          throw new BadRequestException(`The item is missing some variation`);

        const variationsOption = addProductItemInput.variationsItem.map(
          (variationOption) => {
            return { value: variationOption.valueVariation };
          },
        );

        await checkItemExists(productId, variationsOption, prisma);
        await Promise.all(
          addProductItemInput.variationsItem.map(async (variationItem) => {
            const variationOption = await checkVariationOption(
              prisma,
              productId,
              variationItem,
            );
            await createProductConfiguration(
              item.id,
              variationOption.id,
              variationOption.variationId,
              prisma,
            );
            // await createProductConfiguration(prisma, item.id, variationOption);
          }),
        );
      }
      return item;
    });
  }

  deleteProductItem(id: number) {
    return this.prisma.$transaction(async (prisma) => {
      const productItem = await prisma.productItem.findUnique({
        where: { id },
      });

      if (!productItem)
        throw new CustomNotFoundException(
          `productItem with ID ${id} not found`,
        );

      await prisma.productConfiguration.deleteMany({
        where: {
          productItemId: id,
        },
      });

      return await prisma.productItem.delete({
        where: { id },
      });
    });
  }
}
