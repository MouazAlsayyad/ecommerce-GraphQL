import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export async function checkCategory(
  categoryName: string,
  tx: Prisma.TransactionClient,
) {
  const categoryExist = tx.category.findFirst({
    where: { name: categoryName },
  });
  if (!categoryExist)
    throw new NotFoundException(`category with name ${categoryName} not found`);
  return categoryExist;
}

export async function checkBrand(name: string, tx: Prisma.TransactionClient) {
  const brandExist = tx.brand.findFirst({ where: { name } });
  if (!brandExist)
    throw new NotFoundException(`brand with name ${name} not found`);
  return brandExist;
}

export async function addCategory(
  brandId: number,
  categoryId: number,
  tx: Prisma.TransactionClient,
) {
  const brand_category = await tx.brand_Category.findUnique({
    where: { brandId_categoryId: { brandId, categoryId } },
  });
  if (brand_category) return brand_category;
  return tx.brand_Category.create({
    data: { brandId, categoryId },
  });
}

export async function mapBrand(brand) {
  return {
    ...brand,
    category: brand.brand_category.map((category) => {
      return {
        id: category.category.id,
        name: category.category.name,
        description: category.category.description,
        image: category.category.image,
        product: category.category.product_category.map((i) => {
          return {
            id: i.product.id,
            name: i.product.name,
            description: i.product.description,
            coverImage: i.product.coverImage,
            averageRating: i.product.averageRating,
            reviewCount: i.product.averageRating,
            available: i.product.available,
          };
        }),
      };
    }),
  };
}
