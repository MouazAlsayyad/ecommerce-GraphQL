import { CategoryEntity } from '../entities/category-entity.interface';
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../dtos/category-dto.interface';

export interface CategoryRepository {
  create(data: CreateCategoryDTO): Promise<CategoryEntity>;
  findAll(): Promise<CategoryEntity[]>;
  findOne(id: number): Promise<CategoryEntity>;
  update(data: UpdateCategoryDTO): Promise<CategoryEntity>;
  remove(id: number): Promise<void>;
}
