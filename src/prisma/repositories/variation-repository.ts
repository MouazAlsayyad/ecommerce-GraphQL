import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import {
  checkVariationExist,
  checkVariationOptionExist,
  createVariation,
  getVariationById,
} from '../utils/variation-service-utils';
import {
  CreateVariationDTO,
  CreateVariationOptionDTO,
  UpdateVariationDTO,
  UpdateVariationOptionDTO,
  VariationEntity,
  VariationOptionEntity,
} from 'lib/types/src';

@Injectable()
export class PrismaVariationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async insertVariation(data: CreateVariationDTO): Promise<VariationEntity> {
    return this.prisma.$transaction(async (tx) => {
      const { id } = await createVariation(data.productId, data.name, tx);
      await Promise.all(
        data.variationOption.map(async (optionDto) => {
          const dataVariationOption = {
            variationId: id,
            value: optionDto.value,
          };
          await this.insertVariationOption(dataVariationOption);
        }),
      );
      return getVariationById(id, tx);
    });
  }

  async updateVariationNameById(
    data: UpdateVariationDTO,
  ): Promise<VariationEntity> {
    return this.prisma.$transaction(async (tx) => {
      const { productId, name, variationId } = data;
      await checkVariationExist(productId, name, tx);
      await tx.variation.update({ where: { id: variationId }, data: { name } });
      return getVariationById(variationId, tx);
    });
  }

  async insertVariationOption(
    data: CreateVariationOptionDTO,
  ): Promise<VariationOptionEntity> {
    const { variationId, value } = data;
    return this.prisma.$transaction(async (tx) => {
      await checkVariationOptionExist(variationId, value, tx);
      return tx.variationOption.create({
        data: { variationId, value },
      });
    });
  }

  async updateVariationOptionById(
    data: UpdateVariationOptionDTO,
  ): Promise<VariationOptionEntity> {
    return this.prisma.$transaction(async (tx) => {
      const { variationId, value, id } = data;
      await checkVariationOptionExist(variationId, value, tx);
      return tx.variationOption.update({ where: { id }, data: { value } });
    });
  }
}
