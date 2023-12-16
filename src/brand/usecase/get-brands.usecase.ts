import { BrandRepository, UseCase } from 'lib/types/src';
import { Brand } from '../entities/brand.entity';

export class GetBrandsUseCase implements UseCase<void, Promise<Brand[]>> {
  constructor(private brandRepository: BrandRepository) {}

  execute(): Promise<Brand[]> {
    return this.brandRepository.findAll();
  }
}
