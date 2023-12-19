import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import {
  CreateProductDTO,
  FilterDTO,
  ProductCategoryDTO,
  ProductEntity,
  UpdateProductDTO,
} from 'lib/types/src';
import {
  createItems,
  createProductAttributes,
  createProductVariations,
  deleteProductAndRelatedData,
  mapProductWithVariations,
} from '../utils/product-service-uils';
import { checkBrand } from '../utils/brand-service-utils';
import {
  addCategoryToProductName,
  checkcategoryExistByName,
} from '../utils/category-service-utils';

@Injectable()
export class PrismaProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(data: FilterDTO): Promise<ProductEntity[]> {
    const ids = await this.prisma.product.findMany({
      where: data,
      select: { id: true },
    });
    return await Promise.all(
      ids.map(async (product) => {
        return await this.getProductById(product.id);
      }),
    );
  }

  async getProductById(id: number): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
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
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        product_category: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        userReview: {
          select: {
            id: true,
            rating: true,
            userId: true,
            review: true,
            created_at: true,
          },
        },
        attributes: { select: { name: true, value: true } },
        variation: {
          select: {
            id: true,
            name: true,
            variationOptions: { select: { value: true } },
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
                variation: { select: { name: true } },
                variationOption: { select: { value: true } },
              },
            },
          },
        },
      },
    });
    const Product = {
      ...product,
      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
          }
        : null,

      category: product.product_category
        ? product.product_category.map((cat) => {
            return {
              id: cat.category.id,
              name: cat.category.name,
            };
          })
        : null,
    };
    if (!product.productItem) return Product;
    return mapProductWithVariations(Product);
  }

  async insertProduct(data: CreateProductDTO): Promise<ProductEntity> {
    const id = await this.prisma.$transaction(async (tx) => {
      const { name, description, available, coverImage, brand } = data;
      const Brand = await checkBrand(brand, tx);
      const { id } = await tx.product.create({
        data: { name, description, available, coverImage, brandId: Brand.id },
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
      return id;
    });
    if (data.categories) {
      await this.prisma.$transaction(async (tx) => {
        await Promise.all(
          data.categories.map(async (cat) => {
            await addCategoryToProductName(cat, id, tx);
          }),
        );
      });
    }
    return this.getProductById(id);
  }

  async updateProductById(data: UpdateProductDTO): Promise<ProductEntity> {
    await this.prisma.$transaction(async (tx) => {
      if (data.brand) {
        const brand = await checkBrand(data.brand, tx);
        await tx.product.update({
          where: { id: data.id },
          data: {
            available: data.available,
            coverImage: data.coverImage,
            description: data.description,
            name: data.name,
            brandId: brand.id,
          },
        });
      } else {
        await tx.product.update({
          where: { id: data.id },
          data: {
            available: data.available,
            coverImage: data.coverImage,
            description: data.description,
            name: data.name,
          },
        });
      }
    });
    return this.getProductById(data.id);
  }

  async deleteProductById(id: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      return await deleteProductAndRelatedData(tx, id);
    });
    return;
  }

  addCategoryToProduct(data: ProductCategoryDTO): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const { name, productId } = data;
      const category = await checkcategoryExistByName(name, tx);
      const productCategory = await tx.product_Category.findUnique({
        where: { categoryId_productId: { categoryId: category.id, productId } },
      });
      if (productCategory)
        throw new BadRequestException(
          `This product already owns this category`,
        );
      await tx.product_Category.create({
        data: { categoryId: category.id, productId },
      });
      return true;
    });
  }

  removeCategoryToProduct(data: ProductCategoryDTO): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const { name, productId } = data;
      const category = await checkcategoryExistByName(name, tx);
      const productCategory = await tx.product_Category.findUnique({
        where: { categoryId_productId: { categoryId: category.id, productId } },
      });
      if (!productCategory)
        throw new NotFoundException(
          `This product already does not have this category`,
        );
      await tx.product_Category.delete({
        where: { categoryId_productId: { categoryId: category.id, productId } },
      });
      return true;
    });
  }
}
