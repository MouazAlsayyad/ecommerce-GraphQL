import { Injectable } from '@nestjs/common';
import {
  AddCategoriesToBrandInput,
  CreateBrandInput,
  RemoveCategoryFromBrandInput,
} from './dto/create-brand.input';
import { UpdateBrandInput } from './dto/update-brand.input';
import { PrismaBrandRepository } from 'src/prisma/repositories';

@Injectable()
export class BrandService {
  constructor(private brandRepository: PrismaBrandRepository) {}

  create(data: CreateBrandInput) {
    return this.brandRepository.createBrand(data);
  }

  findAll() {
    return this.brandRepository.findAll();
  }

  findOne(id: number) {
    return this.brandRepository.getBrandById(id);
  }

  update(data: UpdateBrandInput) {
    return this.brandRepository.update(data);
  }

  async remove(id: number) {
    const brand = await this.brandRepository.getBrandById(id);
    await this.brandRepository.remove(id);
    return brand;
  }

  addCategoriesToBrand(data: AddCategoriesToBrandInput) {
    return this.brandRepository.addCategories(data);
  }

  removeCategoryFromBrand(data: RemoveCategoryFromBrandInput) {
    return this.brandRepository.removeCategory(data);
  }
}
