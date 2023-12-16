import { CategoryRepository, UseCase } from 'lib/types/src';

import { CreateCategoryInput } from '../dto/create-category.input';
import { Category } from '../entities/category.entity';

export class CreateCategoryUseCase
  implements UseCase<CreateCategoryInput, Promise<Category>>
{
  constructor(private categoryRepository: CategoryRepository) {}

  execute(data: CreateCategoryInput): Promise<Category> {
    return this.categoryRepository.create(data);
  }
}

