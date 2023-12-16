import { ProductItemEntity } from '../entities/item-entity.interface';
import {
  CreateProductItemDTO,
  UpdateProductItemDTO,
} from '../dtos/item-dto.interface';

export interface ProductItemRepository {
  addProductItem(data: CreateProductItemDTO): Promise<ProductItemEntity>;
  updateProductItem(data: UpdateProductItemDTO): Promise<ProductItemEntity>;
  deleteProductItem(id: number): Promise<number>;
}
