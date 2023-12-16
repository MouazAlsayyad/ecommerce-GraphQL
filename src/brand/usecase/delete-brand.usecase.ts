import { BrandRepository, UseCase } from 'lib/types/src';
import { Brand } from '../entities/brand.entity';

export class DeleteBrandUseCase implements UseCase<number, Promise<Brand>> {
  constructor(private brandRepository: BrandRepository) {}

  async execute(brandId: number): Promise<Brand> {
    const brand = await this.brandRepository.getBrandById(brandId);
    await this.brandRepository.remove(brandId);
    return brand;
  }
}
