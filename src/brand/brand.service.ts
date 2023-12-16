import { Injectable } from '@nestjs/common';
import {
  AddCategoriesToBrandInput,
  CreateBrandInput,
  RemoveCategoryFromBrandInput,
} from './dto/create-brand.input';
import { UpdateBrandInput } from './dto/update-brand.input';
import {
  AddCategoriesToBrandUseCase,
  CreateBrandUseCase,
  DeleteBrandUseCase,
  GetBrandUseCase,
  GetBrandsUseCase,
  RemoveCategoryFromBrandUseCase,
  UpdateBrandUseCase,
} from './usecase';
import { PrismaBrandRepository } from 'src/prisma/repositories';

@Injectable()
export class BrandService {
  constructor(private brandRepository: PrismaBrandRepository) {}

  create(data: CreateBrandInput) {
    const createBrandUseCase = new CreateBrandUseCase(this.brandRepository);
    return createBrandUseCase.execute(data);
  }

  findAll() {
    const getBrandsUseCase = new GetBrandsUseCase(this.brandRepository);
    return getBrandsUseCase.execute();
  }

  findOne(id: number) {
    const getBrandUseCase = new GetBrandUseCase(this.brandRepository);
    return getBrandUseCase.execute(id);
  }

  update(data: UpdateBrandInput) {
    const updateBrandUseCase = new UpdateBrandUseCase(this.brandRepository);
    return updateBrandUseCase.execute(data);
  }

  remove(id: number) {
    const deleteBrandUseCase = new DeleteBrandUseCase(this.brandRepository);
    return deleteBrandUseCase.execute(id);
  }

  addCategoriesToBrand(data: AddCategoriesToBrandInput) {
    const addCategoriesToBrandUseCase = new AddCategoriesToBrandUseCase(
      this.brandRepository,
    );
    return addCategoriesToBrandUseCase.execute(data);
  }

  removeCategoryFromBrand(data: RemoveCategoryFromBrandInput) {
    const removeCategoryFromBrandUseCase = new RemoveCategoryFromBrandUseCase(
      this.brandRepository,
    );
    return removeCategoryFromBrandUseCase.execute(data);
  }
}
