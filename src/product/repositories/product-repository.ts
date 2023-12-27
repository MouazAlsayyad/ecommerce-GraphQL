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
} from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';

@Injectable()
export class PrismaProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(where): Promise<Product[]> {
    return this.prisma.product.findMany({ where });
  }

  getProductCategories(productId: number) {
    return this.prisma.category.findMany({
      where: { product_category: { some: { productId } } },
    });
  }

  async getProductById(id: number): Promise<Product> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async insertProduct(data: CreateProductInput): Promise<Product> {
    const id = await this.prisma.$transaction(async (tx) => {
      const { name, description, available, coverImage, brandId } = data;

      const { id } = await tx.product.create({
        data: { name, description, available, coverImage, brandId },
      });

      if (data.attributes)
        await createProductAttributes(id, data.attributes, tx);
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
      return id;
    });

    return this.getProductById(id);
  }

  async updateProductById(data: UpdateProductInput): Promise<Product> {
    await this.prisma.$transaction(async (tx) => {
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

  async deleteProductById(id: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      return await deleteProductAndRelatedData(tx, id);
    });
    return;
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
