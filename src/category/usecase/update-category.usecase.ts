import { CategoryRepository, UseCase } from 'lib/types/src';

import { Category } from '../entities/category.entity';
import { UpdateCategoryInput } from '../dto/update-category.input';

export class UpdateCategoryUseCase
  implements UseCase<UpdateCategoryInput, Promise<Category>>
{
  constructor(private categoryRepository: CategoryRepository) {}

  execute(data: UpdateCategoryInput): Promise<Category> {
    return this.categoryRepository.update(data);
  }
}
