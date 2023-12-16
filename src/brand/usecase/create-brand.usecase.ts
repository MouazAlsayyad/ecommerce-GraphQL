import { BrandRepository, UseCase } from 'lib/types/src';
import { CreateBrandInput } from '../dto/create-brand.input';
import { Brand } from '../entities/brand.entity';

export class CreateBrandUseCase
  implements UseCase<CreateBrandInput, Promise<Brand>>
{
  constructor(private brandRepository: BrandRepository) {}

  execute(data: CreateBrandInput): Promise<Brand> {
    return this.brandRepository.createBrand(data);
  }
}
