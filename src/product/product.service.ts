import { Injectable } from '@nestjs/common';
import {
  AddItemImagesInput,
  AddProductAttributeInput,
  AddProductImagesInput,
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
import { PrismaItemImageRepository } from './repositories/item-image-repository';
import { PrismaProductImageRepository } from './repositories/product-image-repository';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: PrismaProductRepository,
    private attributeRepository: PrismaAttributeRepository,
    private variationRepository: PrismaVariationRepository,
    private itemRepository: PrismaProductItemRepository,
    private itemImageRepository: PrismaItemImageRepository,
    private productImageRepository: PrismaProductImageRepository,
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

  deleteProductById(id: number) {
    return this.productRepository.deleteProductById(id);
  }

  findRelatedProducts(tagIds: number[], productId: number) {
    return this.productRepository.findRelatedProducts(tagIds, productId);
  }

  getProductItemsByProductId(id: number) {
    return this.itemRepository.getProductItemsByProductId(id);
  }

  async addProductItem(data: AddProductItemInput) {
    await this.itemRepository.addProductItem(data);
    return this.findOne(data.productId);
  }

  async updateProductItem(data: UpdateProductItemInput) {
    await this.itemRepository.updateProductItem(data);
    return this.findOne(data.productId);
  }

  deleteProductItem(itemId: number) {
    return this.itemRepository.deleteProductItem(itemId);
  }

  getAttributesByProductId(id: number) {
    return this.attributeRepository.getAttributesByProductId(id);
  }

  async addAttribute(data: AddProductAttributeInput) {
    await this.attributeRepository.addAttribute(data);
    return this.findOne(data.productId);
  }

  async updateAttribute(data: UpdateProductAttributeInput) {
    await this.attributeRepository.updateAttribute(data);
    return this.findOne(data.productId);
  }

  removeAttribute(attributeId: number) {
    return this.attributeRepository.removeAttribute(attributeId);
  }

  getVariationByProductId(id: number) {
    return this.variationRepository.getVariationByProductId(id);
  }

  async addVariationOption(data: AddVariationOptionInput) {
    await this.variationRepository.insertVariationOption(data);
    return this.findOne(data.productId);
  }

  async updateVariationOption(data: UpdateVariationOptionInput) {
    await this.variationRepository.updateVariationOptionById(data);
    return this.findOne(data.productId);
  }

  async updateVariation(data: UpdateVariationInput) {
    await this.variationRepository.updateVariationNameById(data);
    return this.findOne(data.productId);
  }

  async addCategoryToProduct(data: ProductCategoryInput) {
    await this.productRepository.addCategoryToProduct(data);
    return this.findOne(data.productId);
  }
  removeCategoryFromProduct(data: ProductCategoryInput) {
    return this.productRepository.removeCategoryFromProduct(data);
  }

  async addImagesToItem(data: AddItemImagesInput) {
    await this.itemImageRepository.addImagesToItem(data);
    return this.findOne(data.productId);
  }

  getImagesByItemId(itemId: number) {
    return this.itemImageRepository.getImagesByItemId(itemId);
  }

  removeImageFromItem(id: number) {
    return this.itemImageRepository.removeImageFromItem(id);
  }

  async addImagesToProduct(data: AddProductImagesInput) {
    await this.productImageRepository.addImagesToProduct(data);
    return this.findOne(data.productId);
  }

  getImagesByProductId(productId: number) {
    return this.productImageRepository.getImagesByProductId(productId);
  }

  removeImageFromProduct(id: number) {
    return this.productImageRepository.removeImageFromProduct(id);
  }
}
