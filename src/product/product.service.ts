import { Injectable } from '@nestjs/common';
import {
  AddItemImagesInput,
  AddProductAttributeInput,
  AddProductImagesInput,
  AddProductItemInput,
  // AddVariationOptionInput,
  CreateProductInput,
  ProductCategoryInput,
  ProductFilterDTO,
  RemoveProductImageInput,
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
import { productWhereFilter } from 'src/unit/product-filter-map';
import { UserType } from '@prisma/client';

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

  create(createProductInput: CreateProductInput, userId: number) {
    return this.productRepository.insertProduct(createProductInput, userId);
  }

  findAll(filters: ProductFilterDTO) {
    return this.productRepository.getProducts(
      filters?.filter ? productWhereFilter(filters.filter) : {},
      filters?.skip,
      filters?.take,
      filters.orderBy,
    );
  }

  findOne(id: number) {
    return this.productRepository.getProductById(id);
  }

  getProductCategories(id: number) {
    return this.productRepository.getProductCategories(id);
  }

  async update(
    updateProductInput: UpdateProductInput,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(
        updateProductInput.id,
        userId,
      );

    return this.productRepository.updateProductById(updateProductInput);
  }

  async deleteProductById(id: number, userId: number, user_type: UserType) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(id, userId);
    return this.productRepository.deleteProductById(id);
  }

  findRelatedProducts(tagIds: number[], productId: number) {
    return this.productRepository.findRelatedProducts(tagIds, productId);
  }

  getProductItemsByProductId(id: number) {
    return this.itemRepository.getProductItemsByProductId(id);
  }

  async addProductItem(
    data: AddProductItemInput,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(data.productId, userId);
    await this.itemRepository.addProductItem(data);
    return this.findOne(data.productId);
  }

  async updateProductItem(
    data: UpdateProductItemInput,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(data.productId, userId);
    await this.itemRepository.updateProductItem(data);
    return this.findOne(data.productId);
  }

  async deleteProductItem(
    itemId: number,
    productId: number,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(productId, userId);
    return this.itemRepository.deleteProductItem(itemId, productId);
  }

  getAttributesByProductId(id: number) {
    return this.attributeRepository.getAttributesByProductId(id);
  }

  async addAttribute(
    data: AddProductAttributeInput,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(data.productId, userId);
    await this.attributeRepository.addAttribute(data);
    return this.findOne(data.productId);
  }

  async updateAttribute(
    data: UpdateProductAttributeInput,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(data.productId, userId);
    await this.attributeRepository.updateAttribute(data);
    return this.findOne(data.productId);
  }

  async removeAttribute(
    attributeId: number,
    productId: number,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(productId, userId);
    return this.attributeRepository.removeAttribute(attributeId, productId);
  }

  getVariationByProductId(id: number) {
    return this.variationRepository.getVariationByProductId(id);
  }

  async updateVariationOption(
    data: UpdateVariationOptionInput,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(data.productId, userId);
    await this.variationRepository.updateVariationOptionById(data);
    return this.findOne(data.productId);
  }

  async updateVariation(
    data: UpdateVariationInput,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(data.productId, userId);
    await this.variationRepository.updateVariationNameById(data);
    return this.findOne(data.productId);
  }

  async addCategoryToProduct(
    data: ProductCategoryInput,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(data.productId, userId);
    await this.productRepository.addCategoryToProduct(data);
    return this.findOne(data.productId);
  }
  async removeCategoryFromProduct(
    data: ProductCategoryInput,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(data.productId, userId);
    return this.productRepository.removeCategoryFromProduct(data);
  }

  async addImagesToItem(
    data: AddItemImagesInput,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(data.productId, userId);
    await this.itemImageRepository.addImagesToItem(data);
    return this.findOne(data.productId);
  }

  getImagesByItemId(itemId: number) {
    return this.itemImageRepository.getImagesByItemId(itemId);
  }

  async removeImageFromItem(
    id: number,
    productId: number,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(productId, userId);
    return this.itemImageRepository.removeImageFromItem(id, productId);
  }

  async addImagesToProduct(
    data: AddProductImagesInput,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(data.productId, userId);
    await this.productImageRepository.addImagesToProduct(data);
    return this.findOne(data.productId);
  }

  getImagesByProductId(productId: number) {
    return this.productImageRepository.getImagesByProductId(productId);
  }

  async removeImageFromProduct(
    data: RemoveProductImageInput,
    userId: number,
    user_type: UserType,
  ) {
    if (user_type === UserType.SELLER)
      await this.productRepository.identityVerification(data.productId, userId);
    return this.productImageRepository.removeImageFromProduct(
      data.productImageId,
    );
  }
}
