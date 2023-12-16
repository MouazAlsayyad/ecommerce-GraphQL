import { BrandRepository, UseCase } from 'lib/types/src';
import { Brand } from '../entities/brand.entity';

export class GetBrandUseCase implements UseCase<number, Promise<Brand>> {
  constructor(private brandRepository: BrandRepository) {}

  execute(brandId: number): Promise<Brand> {
    return this.brandRepository.getBrandById(brandId);
  }
}
