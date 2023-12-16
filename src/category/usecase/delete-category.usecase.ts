import { CategoryRepository, UseCase } from 'lib/types/src';
import { Category } from '../entities/category.entity';

export class DeleteCategoryUseCase
  implements UseCase<number, Promise<Category>>
{
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne(id);
    await this.categoryRepository.remove(id);
    return category;
  }
}
