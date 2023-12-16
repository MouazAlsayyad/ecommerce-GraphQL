import { BrandRepository, UseCase } from 'lib/types/src';
import { RemoveCategoryFromBrandInput } from '../../dto/create-brand.input';

export class RemoveCategoryFromBrandUseCase
  implements UseCase<RemoveCategoryFromBrandInput, Promise<void>>
{
  constructor(private brandRepository: BrandRepository) {}

  execute(data: RemoveCategoryFromBrandInput): Promise<void> {
    return this.brandRepository.removeCategory(data);
  }
}
