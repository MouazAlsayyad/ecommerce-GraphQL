import { BrandEntity } from '../entities/brand-entity.interface';
import {
  AddCategoriesToBrandDTO,
  CreateBrandDTO,
  RemoveCategoryFromBrandDTO,
  UpdateBrandDTO,
} from '../dtos/brand-dto.interface';

export interface BrandRepository {
  createBrand(data: CreateBrandDTO): Promise<BrandEntity>;
  findAll(): Promise<BrandEntity[]>;
  getBrandById(id: number): Promise<BrandEntity>;
  update(data: UpdateBrandDTO): Promise<BrandEntity>;
  addCategories(data: AddCategoriesToBrandDTO): Promise<BrandEntity>;
  remove(id: number): Promise<void>;
  removeCategory(data: RemoveCategoryFromBrandDTO): Promise<void>;
}
