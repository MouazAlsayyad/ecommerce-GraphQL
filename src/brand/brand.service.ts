import { Injectable } from '@nestjs/common';
import {
  AddCategoriesToBrandInput,
  BrandFilter,
  CreateBrandInput,
  RemoveCategoryFromBrandInput,
} from './dto/create-brand.input';
import { UpdateBrandInput } from './dto/update-brand.input';
import { PrismaBrandRepository } from './brand-repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class BrandService {
  constructor(private brandRepository: PrismaBrandRepository) {}

  create(data: CreateBrandInput) {
    return this.brandRepository.createBrand(data);
  }

  findAll(brandFilter: BrandFilter) {
    const filter: Prisma.BrandWhereInput = {
      ...(brandFilter?.name && {
        name: { contains: brandFilter.name },
      }),
    };
    const orderBy: Prisma.BrandOrderByWithRelationInput = {
      ...(brandFilter?.orderBy && {
        name: brandFilter.orderBy.name,
      }),
    };

    return this.brandRepository.findAll(
      filter,
      orderBy,
      brandFilter.skip,
      brandFilter.take,
    );
  }

  findOne(id: number) {
    return this.brandRepository.getBrandById(id);
  }

  update(data: UpdateBrandInput) {
    return this.brandRepository.update(data);
  }

  async remove(id: number) {
    return await this.brandRepository.remove(id);
  }

  addCategoriesToBrand(data: AddCategoriesToBrandInput) {
    return this.brandRepository.addCategories(data);
  }

  removeCategoryFromBrand(data: RemoveCategoryFromBrandInput) {
    return this.brandRepository.removeCategory(data);
  }
}
