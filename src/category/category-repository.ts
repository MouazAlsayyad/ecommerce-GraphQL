import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from './entities/category.entity';
import {
  CategoryFilterDTO,
  CreateCategoryInput,
} from './dto/create-category.input';

import { UpdateCategoryInput } from './dto/update-category.input';
import { checkImage } from 'src/unit/check-image';

@Injectable()
export class PrismaCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryInput): Promise<Category> {
    const id = await this.prisma.$transaction(async (tx) => {
      const { name, description = null, image = null } = data;
      if (image) await checkImage(image, tx);
      const { id } = await tx.category.create({
        data: { name, description, image },
      });
      return id;
    });

    return this.findOne(id);
  }

  findAll(categoryFilter: CategoryFilterDTO): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: categoryFilter,
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category)
      throw new NotFoundException(`category with this ${id} not found`);
    return category;
  }

  async update(data: UpdateCategoryInput): Promise<Category> {
    const id = await this.prisma.$transaction(async (tx) => {
      if (data.image) await checkImage(data.image, tx);
      const category = await tx.category.findUnique({ where: { id } });
      if (!category)
        throw new NotFoundException(`category with this ${id} not found`);

      await tx.category.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          image: data.image,
        },
      });

      return id;
    });

    return this.findOne(id);
  }

  remove(id: number): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      await this.findOne(id);
      await tx.brand_Category.deleteMany({ where: { categoryId: id } });
      await tx.product_Category.deleteMany({ where: { categoryId: id } });
      await tx.category.delete({ where: { id } });
      return true;
    });
  }
}
