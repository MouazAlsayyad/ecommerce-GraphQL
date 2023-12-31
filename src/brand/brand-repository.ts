import { Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from './entities/brand.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddCategoriesToBrandInput,
  CreateBrandInput,
  RemoveCategoryFromBrandInput,
} from './dto/create-brand.input';
import { UpdateBrandInput } from './dto/update-brand.input';

@Injectable()
export class PrismaBrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBrand(data: CreateBrandInput): Promise<Brand> {
    const id = await this.prisma.$transaction(async (tx) => {
      const { name, description = null, image = null } = data;

      const { id } = await tx.brand.create({
        data: { name, description, image },
      });
      return id;
    });
    return this.getBrandById(id);
  }

  async findAll(): Promise<Brand[]> {
    return this.prisma.brand.findMany();
  }

  async getBrandById(id: number): Promise<Brand> {
    const brand = await this.prisma.brand.findUnique({ where: { id } });

    if (!brand) throw new NotFoundException(`brand with this ${id} not found`);
    return brand;
  }

  async update(data: UpdateBrandInput): Promise<Brand> {
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
    removeCategoryToBrandDTO: RemoveCategoryFromBrandInput,
  ): Promise<void> {
    const { brandId, categoryId } = removeCategoryToBrandDTO;
    await this.prisma.brand_Category.delete({
      where: { brandId_categoryId: { brandId, categoryId } },
    });
    return;
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
