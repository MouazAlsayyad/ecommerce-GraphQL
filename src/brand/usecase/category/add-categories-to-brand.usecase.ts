import { BrandRepository, UseCase } from 'lib/types/src';
import { AddCategoriesToBrandInput } from '../../dto/create-brand.input';
import { Brand } from '../../entities/brand.entity';

export class AddCategoriesToBrandUseCase
  implements UseCase<AddCategoriesToBrandInput, Promise<Brand>>
{
  constructor(private brandRepository: BrandRepository) {}

  execute(data: AddCategoriesToBrandInput): Promise<Brand> {
    return this.brandRepository.addCategories(data);
  }
}
