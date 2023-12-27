import { Injectable } from '@nestjs/common';
import {
  AddProductAttributeInput,
  AddProductItemInput,
  AddVariationOptionInput,
  CreateProductInput,
  ProductCategoryInput,
  ProductFilterDTO,
} from './dto/create-product.input';
import {
  UpdateProductAttributeInput,
  UpdateProductInput,
  UpdateProductItemInput,
  UpdateVariationInput,
  UpdateVariationOptionInput,
} from './dto/update-product.input';

import { PrismaProductRepository } from './repositories/product-repository';
import { PrismaAttributeRepository } from './repositories/attribute-repository';
import { PrismaVariationRepository } from './repositories/variation-repository';
import { PrismaProductItemRepository } from './repositories/item-repository';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: PrismaProductRepository,
    private attributeRepository: PrismaAttributeRepository,
    private variationRepository: PrismaVariationRepository,
    private itemRepository: PrismaProductItemRepository,
  ) {}

  create(createProductInput: CreateProductInput) {
    return this.productRepository.insertProduct(createProductInput);
  }

  findAll(filters: ProductFilterDTO) {
    const price =
      filters?.minPrice || filters?.maxPrice
        ? {
            ...(filters?.minPrice && {
              gte: parseFloat(filters.minPrice.toString()),
            }),
            ...(filters?.maxPrice && {
              lte: parseFloat(filters.maxPrice.toString()),
            }),
          }
        : undefined;

    delete filters?.minPrice;
    delete filters?.maxPrice;

    const filter = {
      ...(filters?.name && { name: filters.name }),
      ...(filters?.brand && { brand: { name: filters.brand } }),
      ...(filters?.categoryId && {
        product_category: { some: { categoryId: filters.categoryId } },
      }),
      ...(price && { productItem: { some: { price } } }),
    };
    return this.productRepository.getProducts(filter);
  }

  findOne(id: number) {
    return this.productRepository.getProductById(id);
  }

  getProductCategories(id: number) {
    return this.productRepository.getProductCategories(id);
  }

  update(updateProductInput: UpdateProductInput) {
    return this.productRepository.updateProductById(updateProductInput);
  }

  remove(id: number) {
    return this.productRepository.deleteProductById(id);
  }

  getProductItemsByProductId(id: number) {
    return this.itemRepository.getProductItemsByProductId(id);
  }

  addProductItem(data: AddProductItemInput) {
    this.itemRepository.addProductItem(data);
  }

  updateProductItem(data: UpdateProductItemInput) {
    this.itemRepository.updateProductItem(data);
  }

  deleteProductItem(itemId: number) {
    this.itemRepository.deleteProductItem(itemId);
  }

  getAttributesByProductId(id: number) {
    return this.attributeRepository.getAttributesByProductId(id);
  }

  addAttribute(data: AddProductAttributeInput) {
    this.attributeRepository.addAttribute(data);
  }

  updateAttribute(data: UpdateProductAttributeInput) {
    this.attributeRepository.updateAttribute(data);
  }

  removeAttribute(attributeId: number) {
    this.attributeRepository.removeAttribute(attributeId);
  }

  getVariationByProductId(id: number) {
    return this.variationRepository.getVariationByProductId(id);
  }

  addVariationOption(data: AddVariationOptionInput) {
    this.variationRepository.insertVariationOption(data);
  }

  updateVariationOption(data: UpdateVariationOptionInput) {
    this.variationRepository.updateVariationOptionById(data);
  }

  updateVariation(data: UpdateVariationInput) {
    this.variationRepository.updateVariationNameById(data);
  }

  addCategoryToProduct(data: ProductCategoryInput) {
    this.productRepository.addCategoryToProduct(data);
  }
  removeCategoryFromProduct(data: ProductCategoryInput) {
    this.productRepository.removeCategoryFromProduct(data);
  }
}
