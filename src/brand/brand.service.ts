import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandInput } from './dto/create-brand.input';
import { UpdateBrandInput } from './dto/update-brand.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}
  create(createBrandInput: CreateBrandInput) {
    return this.prisma.$transaction(async (tx) => {
      const { name, description = null, image = null } = createBrandInput;
      const brand = await tx.brand.findFirst({
        where: {
          name,
        },
      });
      if (brand)
        throw new BadRequestException('There is a brand with the same name');

      return tx.brand.create({
        data: {
          name,
          description,
          image,
        },
      });
    });
  }

  removeCategory(brandId: number, categoryId: number) {
    this.prisma.brand_Category.delete({
      where: {
        brandId_categoryId: {
          brandId,
          categoryId,
        },
      },
    });

    return;
  }

  addCategories(brandId: number, categories: string[]) {
    return this.prisma.$transaction(async (tx) => {
      const categoriesExist = await Promise.all(
        categories.map(async (category) => {
          return await this.checkCategory(category);
        }),
      );

      await Promise.all(
        categoriesExist.map(async (category) => {
          const brand_category = await tx.brand_Category.findUnique({
            where: {
              brandId_categoryId: {
                brandId,
                categoryId: category.id,
              },
            },
          });
          if (brand_category) return brand_category;
          return tx.brand_Category.create({
            data: {
              brandId,
              categoryId: category.id,
            },
          });
        }),
      );
    });
  }

  checkCategory(categoryName: string) {
    const categoryExist = this.prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!categoryExist)
      throw new NotFoundException(
        `category with name ${categoryName} not found`,
      );
    return categoryExist;
  }

  findAll() {
    return this.prisma.brand.findMany();
  }

  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        brand_category: {
          include: {
            category: {
              include: {
                product_category: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!brand) throw new NotFoundException(`brand with this ${id} not found`);
    return brand;
  }

  update(id: number, updateBrandInput: UpdateBrandInput) {
    return this.prisma.$transaction(async (tx) => {
      const brand = await tx.brand.findUnique({ where: { id } });
      if (!brand)
        throw new NotFoundException(`brand with this ${id} not found`);
      return tx.brand.update({
        where: { id },
        data: {
          description: updateBrandInput.description,
          image: updateBrandInput.image,
        },
      });
    });
  }

  remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const brand = await tx.brand.findUnique({ where: { id } });
      if (!brand)
        throw new NotFoundException(`brand with this ${id} not found`);
      return tx.brand.delete({ where: { id } });
    });
  }
}
