import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CategoryEntity,
  CategoryRepository,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from 'lib/types/src';
import { PrismaService } from '../prisma.service';
import {
  checkCategoryExistById,
  checkcategoryExistByName,
  mapCategory,
} from '../utils/category-service-utils';
@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDTO): Promise<CategoryEntity> {
    const id = await this.prisma.$transaction(async (tx) => {
      const { name, description = null, image = null } = data;
      await checkcategoryExistByName(name, tx);

      const { id } = await tx.category.create({
        data: { name, description, image },
      });
      return id;
    });

    return this.findOne(id);
  }

  findAll(): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany();
  }

  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { product_category: { include: { product: true } } },
    });
    if (!category)
      throw new NotFoundException(`category with this ${id} not found`);
    return mapCategory(category);
  }

  async update(data: UpdateCategoryDTO): Promise<CategoryEntity> {
    const id = await this.prisma.$transaction(async (tx) => {
      const { id, name = null, description = null, image = null } = data;
      const category = await tx.category.findUnique({ where: { id } });
      if (!category)
        throw new NotFoundException(`category with this ${id} not found`);
      if (name) await checkcategoryExistByName(name, tx);

      await tx.category.update({
        where: { id },
        data: { name, description, image },
      });

      return id;
    });

    return this.findOne(id);
  }

  remove(id: number): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      await checkCategoryExistById(id, tx);
      await tx.brand_Category.deleteMany({ where: { categoryId: id } });
      await tx.product_Category.deleteMany({ where: { categoryId: id } });
      await tx.category.delete({ where: { id } });
      return;
    });
  }
}
