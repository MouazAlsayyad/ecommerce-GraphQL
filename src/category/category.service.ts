import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoriesUseCase,
  GetCategoryUseCase,
  UpdateCategoryUseCase,
} from './usecase';
import { PrismaCategoryRepository } from 'src/prisma/repositories';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: PrismaCategoryRepository) {}

  create(data: CreateCategoryInput) {
    const createCategoryUseCase = new CreateCategoryUseCase(
      this.categoryRepository,
    );
    return createCategoryUseCase.execute(data);
  }

  findAll() {
    const getCategoriesUseCase = new GetCategoriesUseCase(
      this.categoryRepository,
    );
    return getCategoriesUseCase.execute();
  }

  findOne(id: number) {
    const getCategoryUseCase = new GetCategoryUseCase(this.categoryRepository);
    return getCategoryUseCase.execute(id);
  }

  update(data: UpdateCategoryInput) {
    const updateCategoryUseCase = new UpdateCategoryUseCase(
      this.categoryRepository,
    );
    return updateCategoryUseCase.execute(data);
  }

  remove(id: number) {
    const deteteCategoryUseCase = new DeleteCategoryUseCase(
      this.categoryRepository,
    );
    return deteteCategoryUseCase.execute(id);
  }
}
