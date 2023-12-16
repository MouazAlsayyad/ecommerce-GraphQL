import { ProductAttributeEntity } from '../entities/attribute-entity.interface';
import {
  CreateAttributeDTO,
  UpdateAttributeDTO,
} from '../dtos/attribute-dto.interface';

export interface AttributeRepository {
  addAttribute(data: CreateAttributeDTO): Promise<ProductAttributeEntity>;
  updateAttribute(data: UpdateAttributeDTO): Promise<ProductAttributeEntity>;
  removeAttribute(attributeId: number): Promise<number>;
}
