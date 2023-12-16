import { CategoryRepository, UseCase } from 'lib/types/src';
import { Category } from '../entities/category.entity';

export class GetCategoryUseCase implements UseCase<number, Promise<Category>> {
  constructor(private categoryRepository: CategoryRepository) {}

  execute(id: number): Promise<Category> {
    return this.categoryRepository.findOne(id);
  }
}
