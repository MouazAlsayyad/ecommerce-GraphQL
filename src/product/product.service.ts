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

import {
  PrismaAttributeRepository,
  PrismaProductItemRepository,
  PrismaProductRepository,
  PrismaVariationRepository,
} from 'src/prisma/repositories';

import {
  AddAttributeUseCase,
  AddCategoryUseCase,
  AddProductItemUseCase,
  AddVariationOptionUseCase,
  CreateProductUseCase,
  DeleteAttributeUseCase,
  DeleteCategoryUseCase,
  DeleteProductItemUseCase,
  DeleteProductUseCase,
  GetProductUseCase,
  GetProductsUseCase,
  UpdateAttributeUseCase,
  UpdateProductItemUseCase,
  UpdateProductUseCase,
  UpdateVariationOptionUseCase,
  UpdateVariationUseCase,
} from './usecases';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: PrismaProductRepository,
    private attributeRepository: PrismaAttributeRepository,
    private variationRepository: PrismaVariationRepository,
    private itemRepository: PrismaProductItemRepository,
  ) {}

  create(createProductInput: CreateProductInput) {
    const createProductUseCase = new CreateProductUseCase(
      this.productRepository,
    );
    return createProductUseCase.execute(createProductInput);
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
      ...(filters?.category && {
        product_category: { every: { category: { name: filters.category } } },
      }),
      ...(price && { productItem: { some: { price } } }),
    };
    const getProductsUseCase = new GetProductsUseCase(this.productRepository);
    return getProductsUseCase.execute(filter);
  }

  findOne(id: number) {
    const getProductUseCase = new GetProductUseCase(this.productRepository);
    return getProductUseCase.execute(id);
  }

  update(updateProductInput: UpdateProductInput) {
    const updateProductUseCase = new UpdateProductUseCase(
      this.productRepository,
    );
    return updateProductUseCase.execute(updateProductInput);
  }

  remove(id: number) {
    const deleteProductUseCase = new DeleteProductUseCase(
      this.productRepository,
    );
    return deleteProductUseCase.execute(id);
  }

  addProductItem(data: AddProductItemInput) {
    const addProductItemUseCase = new AddProductItemUseCase(
      this.itemRepository,
      this.productRepository,
    );
    return addProductItemUseCase.execute(data);
  }

  updateProductItem(data: UpdateProductItemInput) {
    const updateProductItemUseCase = new UpdateProductItemUseCase(
      this.itemRepository,
      this.productRepository,
    );
    return updateProductItemUseCase.execute(data);
  }

  deleteProductItem(itemId: number) {
    const deleteProductItemUseCase = new DeleteProductItemUseCase(
      this.itemRepository,
      this.productRepository,
    );
    return deleteProductItemUseCase.execute(itemId);
  }

  addAttribute(data: AddProductAttributeInput) {
    const addAttributeUseCase = new AddAttributeUseCase(
      this.attributeRepository,
      this.productRepository,
    );
    return addAttributeUseCase.execute(data);
  }

  updateAttribute(data: UpdateProductAttributeInput) {
    const updateAttributeUseCase = new UpdateAttributeUseCase(
      this.attributeRepository,
      this.productRepository,
    );
    return updateAttributeUseCase.execute(data);
  }

  removeAttribute(attributeId: number) {
    const deleteAttributeUseCase = new DeleteAttributeUseCase(
      this.attributeRepository,
      this.productRepository,
    );
    return deleteAttributeUseCase.execute(attributeId);
  }

  addVariationOption(data: AddVariationOptionInput) {
    const addVariationOptionUseCase = new AddVariationOptionUseCase(
      this.variationRepository,
      this.productRepository,
    );
    return addVariationOptionUseCase.execute(data);
  }

  updateVariationOption(data: UpdateVariationOptionInput) {
    const updateVariationOptionUseCase = new UpdateVariationOptionUseCase(
      this.variationRepository,
      this.productRepository,
    );
    return updateVariationOptionUseCase.execute(data);
  }

  updateVariation(data: UpdateVariationInput) {
    const updateVariationUseCase = new UpdateVariationUseCase(
      this.variationRepository,
      this.productRepository,
    );
    return updateVariationUseCase.execute(data);
  }

  addCategoryToProduct(data: ProductCategoryInput) {
    const addCategoryUseCase = new AddCategoryUseCase(this.productRepository);
    return addCategoryUseCase.execute(data);
  }
  removeCategoryFromProduct(data: ProductCategoryInput) {
    const deleteCategoryUseCase = new DeleteCategoryUseCase(
      this.productRepository,
    );
    return deleteCategoryUseCase.execute(data);
  }
}
