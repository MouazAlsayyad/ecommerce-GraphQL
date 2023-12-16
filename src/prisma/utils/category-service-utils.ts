import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export async function checkcategoryExistByName(
  name: string,
  tx: Prisma.TransactionClient,
) {
  const categoryExist = await tx.category.findFirst({ where: { name } });
  if (categoryExist)
    throw new BadRequestException('There is a category with the same name');
  return categoryExist;
}

export async function addCategoryToProductName(
  name: string,
  productId: number,
  tx: Prisma.TransactionClient,
) {
  const category = await tx.category.findFirst({ where: { name } });
  if (!category)
    throw new NotFoundException(`category with Name ${name} not found`);
  const product = await tx.product_Category.findUnique({
    where: { categoryId_productId: { categoryId: category.id, productId } },
  });
  if (product)
    throw new BadRequestException(
      `The product already has a category named Already ${name}`,
    );

  await tx.product_Category.create({
    data: { categoryId: category.id, productId },
  });
}

export async function checkCategoryExistById(
  id: number,
  tx: Prisma.TransactionClient,
) {
  const category = await tx.category.findUnique({ where: { id } });
  if (!category)
    throw new NotFoundException(`category with ID ${id} not found`);
}

export async function mapCategory(category) {
  return {
    ...category,
    product: category.product_category.map((i) => {
      return i.product;
    }),
  };
}
