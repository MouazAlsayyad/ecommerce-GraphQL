import { ProductEntity } from '../entities/product-entity.interface';
import {
  CreateProductDTO,
  FilterDTO,
  ProductCategoryDTO,
  UpdateProductDTO,
} from '../dtos/product-dto.interface';

export interface ProductRepository {
  getProducts(data: FilterDTO): Promise<ProductEntity[]>;
  getProductById(id: number): Promise<ProductEntity>;
  insertProduct(data: CreateProductDTO): Promise<ProductEntity>;
  updateProductById(data: UpdateProductDTO): Promise<ProductEntity>;
  deleteProductById(id: number): Promise<void>;
  addCategoryToProduct(data: ProductCategoryDTO): Promise<boolean>;
  removeCategoryToProduct(data: ProductCategoryDTO): Promise<boolean>;
}
