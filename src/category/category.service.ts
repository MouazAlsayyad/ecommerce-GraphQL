import { Injectable } from '@nestjs/common';
import {
  CategoryFilterInput,
  CreateCategoryInput,
} from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaCategoryRepository } from './category-repository';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: PrismaCategoryRepository) {}

  create(data: CreateCategoryInput) {
    return this.categoryRepository.create(data);
  }

  getAllCategories(categoryFilter: CategoryFilterInput) {
    const filter = {
      ...(categoryFilter?.brandId && {
        brand_category: { some: { brandId: categoryFilter.brandId } },
      }),
      ...(categoryFilter?.categoryName && {
        name: { contains: categoryFilter.categoryName },
      }),
    };

    return this.categoryRepository.findAll(filter);
  }

  findOne(id: number) {
    return this.categoryRepository.findOne(id);
  }

  update(data: UpdateCategoryInput) {
    return this.categoryRepository.update(data);
  }

  remove(id: number) {
    return this.categoryRepository.remove(id);
  }
}
