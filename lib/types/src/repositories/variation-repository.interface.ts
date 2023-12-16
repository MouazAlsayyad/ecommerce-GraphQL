import { VariationOption } from 'src/product/entities/product.entity';
import {
  VariationEntity,
  VariationOptionEntity,
} from '../entities/variation-entity.interface';
import {
  CreateVariationDTO,
  CreateVariationOptionDTO,
  UpdateVariationDTO,
  UpdateVariationOptionDTO,
} from '../dtos/variation-dto.interface';

export interface VariationRepository {
  insertVariation(data: CreateVariationDTO): Promise<VariationEntity>;
  insertVariationOption(
    data: CreateVariationOptionDTO,
  ): Promise<VariationOption>;
  updateVariationNameById(data: UpdateVariationDTO): Promise<VariationEntity>;
  updateVariationOptionById(
    data: UpdateVariationOptionDTO,
  ): Promise<VariationOptionEntity>;
}
