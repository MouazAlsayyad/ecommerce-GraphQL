import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createItems,
  createProductAttributes,
  createProductVariations,
  deleteProductAndRelatedData,
} from '../utils/product-service-utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from '../entities/product.entity';
import {
  CreateProductInput,
  ProductCategoryInput,
  ProductOrderBy,
} from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { checkImage } from 'src/unit/check-image';
import { Prisma } from '@prisma/client';
import { ForbiddenError } from '@nestjs/apollo';

@Injectable()
export class PrismaProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(
    where: Prisma.ProductWhereInput,
    cursor: number | null = null,
    take: number | null = 10,
    orderBy: ProductOrderBy,
  ): Promise<Product[]> {
    if (orderBy === 'PriceLowToHigh') {
      const ids = await this.prisma.productItem.findMany({
        where: { product: where },
        select: { productId: true },
        distinct: ['productId'],
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        take,
        orderBy: {
          price: 'asc',
        },
      });

      const products = await this.prisma.product.findMany({
        where: {
          id: {
            in: ids.map((id) => {
              return id.productId;
            }),
          },
        },
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        take,
        include: {
          productItem: true,
        },
      });

      return this.sortByPriceAscending(products);
    } else if (orderBy === 'PriceHighToLow') {
      const ids = await this.prisma.productItem.findMany({
        where: { product: where },
        select: { productId: true },
        distinct: ['productId'],
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        take,
        orderBy: {
          price: 'desc',
        },
      });

      const products = await this.prisma.product.findMany({
        where: {
          id: {
            in: ids.map((id) => {
              return id.productId;
            }),
          },
        },
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        take,
        include: {
          productItem: true,
        },
      });

      return this.sortByPriceDescending(products);
    } else if (orderBy === 'AvgCustomerReview') {
      return this.prisma.product.findMany({
        where,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        take,
        orderBy: {
          averageRating: 'desc',
        },
      });
    } else if (orderBy === 'NewProduct') {
      return await this.prisma.product.findMany({
        where,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      return this.prisma.product.findMany({
        where,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        take,
      });
    }
  }

  private sortByPriceAscending = (products: Product[]): Product[] => {
    return products.sort((a, b) => {
      const priceA = Math.min(...a.productItem.map((item) => item.price));
      const priceB = Math.min(...b.productItem.map((item) => item.price));
      return priceA - priceB;
    });
  };

  private sortByPriceDescending = (products: Product[]): Product[] => {
    return products.sort((a, b) => {
      const priceA = Math.max(...a.productItem.map((item) => item.price));
      const priceB = Math.max(...b.productItem.map((item) => item.price));
      return priceB - priceA;
    });
  };

  getProductCategories(productId: number) {
    return this.prisma.category.findMany({
      where: { product_category: { some: { productId } } },
    });
  }

  async getProductById(id: number): Promise<Product> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async identityVerification(userId: number, id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (product.userId !== userId) {
      throw new ForbiddenError(
        `You do not have permission to access this resource.`,
      );
    }
  }

  async insertProduct(
    data: CreateProductInput,
    userId: number,
  ): Promise<Product> {
    const id = await this.prisma.$transaction(async (tx) => {
      const { name, description, available, coverImage, brandId } = data;
      await checkImage(coverImage, tx);

      const { id } = await tx.product.create({
        data: {
          name,
          description,
          available,
          coverImage,
          brandId,
          userId,
        },
      });

      if (data.attributes)
        await createProductAttributes(id, data.attributes, tx);

      if (data.image) {
        const productImage = await Promise.all(
          data.image.map(async (imagePath) => {
            await checkImage(imagePath, tx);
            return { imagePath, productId: id };
          }),
        );
        tx.productImage.createMany({ data: productImage });
      }
      if (data.variation) await createProductVariations(id, data.variation, tx);
      if (data.variation && data.productItem) {
        data.productItem.map((item) => {
          if (item.variationsItem.length !== data.variation.length)
            throw new BadRequestException(`The item is missing some variation`);
        });
        await createItems(id, data.productItem, tx);
      }
      if (data.categoriesIds) {
        const categories = data.categoriesIds.map((categoryId) => {
          return { categoryId, productId: id };
        });
        tx.product_Category.createMany({ data: categories });
      }

      if (data.productTag)
        await this.addTagsToNewProduct([...new Set(data.productTag)], id, tx);

      return id;
    });

    return this.getProductById(id);
  }

  private async addTagsToNewProduct(
    tags: string[],
    productId: number,
    tx: Prisma.TransactionClient,
  ) {
    const data = await Promise.all(
      tags.map(async (value) => {
        const tagId = await this.findOrCreateTag(value.toLowerCase(), tx);
        return { productId, tagId };
      }),
    );
    return tx.product_Tag.createMany({ data });
  }

  private async findOrCreateTag(
    value: string,
    tx: Prisma.TransactionClient,
  ): Promise<number> {
    const tag = await tx.tag.findFirst({ where: { value } });
    if (tag) return tag.id;
    const newTag = await tx.tag.create({ data: { value } });
    return newTag.id;
  }

  findRelatedProducts(tagIds: number[], productId: number): Promise<Product[]> {
    const where = {
      product_tag: { some: { tagId: { in: tagIds } } },
      id: { not: productId },
    };

    return this.prisma.product.findMany({
      where,
    });
  }

  async updateProductById(data: UpdateProductInput): Promise<Product> {
    await this.prisma.$transaction(async (tx) => {
      if (data.coverImage) await checkImage(data.coverImage, tx);

      await tx.product.update({
        where: { id: data.id },
        data: {
          available: data.available,
          coverImage: data.coverImage,
          description: data.description,
          name: data.name,
          brandId: data.brandId,
        },
      });
    });
    return this.getProductById(data.id);
  }

  async deleteProductById(id: number): Promise<boolean> {
    return await this.prisma.$transaction(async (tx) => {
      await deleteProductAndRelatedData(tx, id);
      return true;
    });
  }

  addCategoryToProduct(data: ProductCategoryInput): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const { categoryId, productId } = data;
      const productCategory = await tx.product_Category.findUnique({
        where: { categoryId_productId: { categoryId, productId } },
      });
      if (productCategory)
        throw new BadRequestException(
          `This product already owns this category`,
        );
      await tx.product_Category.create({
        data: { categoryId, productId },
      });
      return true;
    });
  }

  removeCategoryFromProduct(data: ProductCategoryInput): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const { categoryId, productId } = data;
      const productCategory = await tx.product_Category.findUnique({
        where: { categoryId_productId: { categoryId, productId } },
      });
      if (!productCategory)
        throw new NotFoundException(
          `This product already does not have this category`,
        );
      await tx.product_Category.delete({
        where: { categoryId_productId: { categoryId, productId } },
      });
      return true;
    });
  }
}
