import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import {
  checkVariationExist,
  checkVariationOptionExist,
  createVariation,
  getVariationById,
} from '../utils/variation-service-utils';
import {
  AddVariationOptionInput,
  VariationInput,
} from '../dto/create-product.input';
import { Variation, VariationOption } from '../entities/variation.entity';
import {
  UpdateVariationInput,
  UpdateVariationOptionInput,
} from '../dto/update-product.input';

@Injectable()
export class PrismaVariationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insertVariation(data: VariationInput): Promise<Variation> {
    return this.prisma.$transaction(async (tx) => {
      const { id } = await createVariation(data.productId, data.name, tx);
      await Promise.all(
        data.variationOption.map(async (optionDto) => {
          const dataVariationOption = {
            variationId: id,
            value: optionDto.value,
            productId: data.productId,
          };
          await this.insertVariationOption(dataVariationOption);
        }),
      );
      return getVariationById(id, tx);
    });
  }

  getVariationByProductId(productId: number) {
    return this.prisma.variation.findMany({
      where: { productId },
      include: { variationOptions: true },
    });
  }

  async updateVariationNameById(
    data: UpdateVariationInput,
  ): Promise<Variation> {
    return this.prisma.$transaction(async (tx) => {
      const { productId, name, variationId } = data;
      await checkVariationExist(productId, name, tx);
      await tx.variation.update({ where: { id: variationId }, data: { name } });
      return getVariationById(variationId, tx);
    });
  }

  async insertVariationOption(
    data: AddVariationOptionInput,
  ): Promise<VariationOption> {
    const { variationId, value } = data;
    return this.prisma.$transaction(async (tx) => {
      await checkVariationOptionExist(variationId, value, tx);
      return tx.variationOption.create({
        data: { variationId, value },
      });
    });
  }

  async updateVariationOptionById(
    data: UpdateVariationOptionInput,
  ): Promise<VariationOption> {
    return this.prisma.$transaction(async (tx) => {
      const { variationId, value, id } = data;
      await checkVariationOptionExist(variationId, value, tx);
      return tx.variationOption.update({ where: { id }, data: { value } });
    });
  }
}
