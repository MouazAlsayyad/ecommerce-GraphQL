import { BrandRepository, UseCase } from 'lib/types/src';
import { Brand } from '../entities/brand.entity';
import { UpdateBrandInput } from '../dto/update-brand.input';

export class UpdateBrandUseCase
  implements UseCase<UpdateBrandInput, Promise<Brand>>
{
  constructor(private brandRepository: BrandRepository) {}

  execute(data: UpdateBrandInput): Promise<Brand> {
    return this.brandRepository.update(data);
  }
}
