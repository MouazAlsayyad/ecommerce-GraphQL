import { CategoryRepository, UseCase } from 'lib/types/src';
import { Category } from '../entities/category.entity';

export class GetCategoriesUseCase
  implements UseCase<void, Promise<Category[]>>
{
  constructor(private categoryRepository: CategoryRepository) {}

  execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
