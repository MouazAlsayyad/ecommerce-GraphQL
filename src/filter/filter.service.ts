import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductFilterDTO } from 'src/product/dto/create-product.input';
import { productWhereFilter } from 'src/unit/product-filter-map';
import { VariationFilter } from './entities/filter.entity';

@Injectable()
export class FilterService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(filters: ProductFilterDTO) {
    filters.name = 'sh';
    const product = productWhereFilter(filters);

    const promiseMinPrice = this.prisma.productItem.findFirst({
      where: { product },
      select: { price: true },
      orderBy: { price: 'asc' },
    });

    const promiseMaxPrice = this.prisma.productItem.findFirst({
      where: { product },
      select: { price: true },
      orderBy: { price: 'desc' },
    });

    const promiseCategory = this.prisma.category.findMany({
      where: {
        product_category: { some: { product } },
      },
      distinct: 'id',
    });

    const promiseBrand = this.prisma.brand.findMany({
      where: {
        product: { some: product },
      },
      distinct: 'id',
    });

    const promiseVariationOption = await this.prisma.variationOption.findMany({
      where: { variation: { product } },
      select: { value: true, variation: { select: { name: true } } },
      distinct: 'value',
    });

    const [minPrice, maxPrice, category, brand, variationOption] =
      await Promise.all([
        promiseMinPrice,
        promiseMaxPrice,
        promiseCategory,
        promiseBrand,
        promiseVariationOption,
      ]);

    const variation: VariationFilter[] = variationOption.reduce(
      (result, item) => {
        const existingItem = result.find(
          (entry) => entry.name === item.variation.name,
        );

        if (existingItem)
          existingItem.variationOptionFilter.push({ value: item.value });
        else
          result.push({
            name: item.variation.name,
            variationOptionFilter: [{ value: item.value }],
          });

        return result;
      },
      [],
    );

    return {
      minPrice: minPrice?.price,
      maxPrice: maxPrice?.price,
      category,
      brand,
      variationFilter: variation,
    };
  }
}
