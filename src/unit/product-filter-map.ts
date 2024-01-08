import { Prisma } from '@prisma/client';
import { ProductFilterDTO } from 'src/product/dto/create-product.input';

export function productWhereFilter(
  filters: ProductFilterDTO,
): Prisma.ProductWhereInput {
  const price =
    filters?.minPrice || filters?.maxPrice
      ? {
          ...(filters?.minPrice && {
            gte: parseFloat(filters.minPrice.toString()),
          }),
          ...(filters?.maxPrice && {
            lte: parseFloat(filters.maxPrice.toString()),
          }),
        }
      : undefined;

  delete filters?.minPrice;
  delete filters?.maxPrice;

  const filter: Prisma.ProductWhereInput = {
    ...(filters?.averageRating && {
      averageRating: { gte: parseFloat(filters.averageRating.toString()) },
    }),
    ...(filters?.name && {
      OR: [
        { name: { contains: filters.name, mode: 'insensitive' } },
        { description: { contains: filters.name, mode: 'insensitive' } },
        {
          attributes: {
            some: {
              OR: [
                { name: { contains: filters.name, mode: 'insensitive' } },
                { value: { contains: filters.name, mode: 'insensitive' } },
              ],
            },
          },
        },
        {
          productItem: {
            some: {
              productConfiguration: {
                some: {
                  variationOption: {
                    value: { contains: filters.name, mode: 'insensitive' },
                  },
                },
              },
            },
          },
        },
      ],
    }),
    ...(filters?.variationOptions && {
      variation: {
        some: {
          variationOptions: {
            some: {
              value: {
                contains: filters.variationOptions,
                mode: 'insensitive',
              },
            },
          },
        },
      },
    }),
    ...(filters?.brandId && { brandId: filters.brandId }),
    ...(filters?.brand && {
      brand: { name: { contains: filters.brand, mode: 'insensitive' } },
    }),
    ...(filters?.category && {
      category: { name: { contains: filters.category, mode: 'insensitive' } },
    }),
    ...(filters?.categoryId && {
      product_category: { some: { categoryId: filters.categoryId } },
    }),
    ...(price && { productItem: { some: { price } } }),
  };

  return filter;
}
