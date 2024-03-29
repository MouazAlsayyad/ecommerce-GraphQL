import { Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from './entities/brand.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddCategoriesToBrandInput,
  CreateBrandInput,
  RemoveCategoryFromBrandInput,
} from './dto/create-brand.input';
import { UpdateBrandInput } from './dto/update-brand.input';
import { checkImage } from 'src/unit/check-image';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaBrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBrand(data: CreateBrandInput): Promise<Brand> {
    const id = await this.prisma.$transaction(async (tx) => {
      const { name, description = null, image = null, categories = [] } = data;
      if (image) await checkImage(image, tx);

      const { id } = await tx.brand.create({
        data: { name, description, image },
      });
      if (categories) {
        const data = await Promise.all(
          categories.map(async (categoryId) => {
            return { brandId: id, categoryId };
          }),
        );
        await tx.brand_Category.createMany({ data });
      }
      return id;
    });
    return this.getBrandById(id);
  }

  async findAll(
    where: Prisma.BrandWhereInput = {},
    orderBy: Prisma.BrandOrderByWithRelationInput = {},
    cursor: number | null = null,
    take: number | null = 10,
  ): Promise<Brand[]> {
    return this.prisma.brand.findMany({
      where,
      orderBy,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      take,
    });
  }

  async getBrandById(id: number): Promise<Brand> {
    const brand = await this.prisma.brand.findUnique({ where: { id } });

    if (!brand) throw new NotFoundException(`brand with this ${id} not found`);
    return brand;
  }

  async update(data: UpdateBrandInput): Promise<Brand> {
    const id = await this.prisma.$transaction(async (tx) => {
      if (data.image) await checkImage(data.image, tx);
      const brand = await tx.brand.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          image: data.image,
        },
      });

      if (!brand)
        throw new NotFoundException(`brand with this ${id} not found`);

      return id;
    });

    return this.getBrandById(id);
  }

  remove(id: number): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      await tx.brand.delete({ where: { id } });
      return true;
    });
  }

  async removeCategory(
    removeCategoryToBrandDTO: RemoveCategoryFromBrandInput,
  ): Promise<boolean> {
    const { brandId, categoryId } = removeCategoryToBrandDTO;
    await this.prisma.brand_Category.delete({
      where: { brandId_categoryId: { brandId, categoryId } },
    });
    return true;
  }

  async addCategories(
    addCategoriesToBrandDTO: AddCategoriesToBrandInput,
  ): Promise<Brand> {
    await this.prisma.$transaction(async (tx) => {
      const { brandId, categories } = addCategoriesToBrandDTO;
      const data = await Promise.all(
        categories.map(async (categoryId) => {
          return { brandId, categoryId };
        }),
      );

      return await tx.brand_Category.createMany({ data });
    });

    return this.getBrandById(addCategoriesToBrandDTO.brandId);
  }
}
