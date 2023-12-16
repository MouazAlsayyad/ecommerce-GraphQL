import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  create(createCategoryInput: CreateCategoryInput) {
    return this.prisma.$transaction(async (tx) => {
      const { name, description = null, image = null } = createCategoryInput;
      const category = await tx.category.findFirst({
        where: {
          name,
        },
      });
      if (category)
        throw new BadRequestException('There is a category with the same name');

      return tx.category.create({
        data: {
          name,
          description,
          image,
        },
      });
    });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category)
      throw new NotFoundException(`category with this ${id} not found`);
    return category;
  }

  update(id: number, updateCategoryInput: UpdateCategoryInput) {
    return this.prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({ where: { id } });
      if (!category)
        throw new NotFoundException(`category with this ${id} not found`);
      if (updateCategoryInput.name) {
        const categoryExist = await tx.category.findFirst({
          where: {
            name: updateCategoryInput.name,
          },
        });
        if (categoryExist)
          throw new BadRequestException(
            'There is a category with the same name',
          );
      }

      return tx.category.update({
        where: { id },
        data: {
          name: updateCategoryInput.name,
          description: updateCategoryInput.description,
          image: updateCategoryInput.image,
        },
      });
    });
  }

  remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({ where: { id } });
      if (!category)
        throw new NotFoundException(`category with this ${id} not found`);
      return tx.category.delete({ where: { id } });
    });
  }
}
