import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import {
  AddCategoriesToBrandDTO,
  BrandEntity,
  CreateBrandDTO,
  RemoveCategoryFromBrandDTO,
  UpdateBrandDTO,
} from 'lib/types/src';
import {
  addCategory,
  checkCategory,
  mapBrand,
} from '../utils/brand-service-utils';

@Injectable()
export class PrismaBrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBrand(data: CreateBrandDTO): Promise<BrandEntity> {
    const id = await this.prisma.$transaction(async (tx) => {
      const { name, description = null, image = null } = data;

      const { id } = await tx.brand.create({
        data: { name, description, image },
      });
      return id;
    });
    return this.getBrandById(id);
  }

  async findAll(): Promise<BrandEntity[]> {
    const brands = await this.prisma.brand.findMany({ select: { id: true } });
    return Promise.all(
      brands.map((brand) => {
        return this.getBrandById(brand.id);
      }),
    );
  }
  async getBrandById(id: number): Promise<BrandEntity> {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        brand_category: {
          include: {
            category: {
              include: { product_category: { include: { product: true } } },
            },
          },
        },
      },
    });

    if (!brand) throw new NotFoundException(`brand with this ${id} not found`);
    if (!brand.brand_category.length) return brand;
    const Brand = mapBrand(brand);
    return Brand;
  }

  async update(data: UpdateBrandDTO): Promise<BrandEntity> {
    const id = await this.prisma.$transaction(async (tx) => {
      const { id, name = null, description = null, image = null } = data;
      const brand = await tx.brand.update({
        where: { id },
        data: { name, description, image },
      });

      if (!brand)
        throw new NotFoundException(`brand with this ${id} not found`);

      return id;
    });

    return this.getBrandById(id);
  }

  remove(id: number): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      await tx.brand.delete({ where: { id } });
    });
  }

  async removeCategory(
    removeCategoryToBrandDTO: RemoveCategoryFromBrandDTO,
  ): Promise<void> {
    const { brandId, categoryId } = removeCategoryToBrandDTO;
    await this.prisma.brand_Category.delete({
      where: { brandId_categoryId: { brandId, categoryId } },
    });
    return;
  }

  async addCategories(
    addCategoriesToBrandDTO: AddCategoriesToBrandDTO,
  ): Promise<BrandEntity> {
    const { brandId, categories } = addCategoriesToBrandDTO;
    await this.prisma.$transaction(async (tx) => {
      const categoriesExist = await Promise.all(
        categories.map(async (category) => {
          return await checkCategory(category, tx);
        }),
      );

      await Promise.all(
        categoriesExist.map(async (category) => {
          return await addCategory(brandId, category.id, tx);
        }),
      );

      tx.brand.findUnique({
        where: { id: brandId },
        include: {
          brand_category: {
            include: { category: { select: { id: true, name: true } } },
          },
        },
      });
    });

    return this.getBrandById(brandId);
  }
}
