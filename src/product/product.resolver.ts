import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import {
  Attribute,
  Product,
  ProductItem,
  Variation,
  VariationOption,
} from './entities/product.entity';

import {
  AddProductAttributeDTO,
  AddProductItemDTO,
  AddVariationOptionDTO,
  CreateProductInput,
  ProductFilterDTO,
} from './dto/create-product.input';
import {
  UpdateProductAttributeDTO,
  UpdateProductInput,
  UpdateProductItemDTO,
  UpdateVariationDTO,
  UpdateVariationOptionDTO,
} from './dto/update-product.input';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return await this.productService.create(createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  findAll(@Args('filters', { nullable: true }) filters: ProductFilterDTO) {
    return this.productService.findAll(filters);
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.update(
      updateProductInput.id,
      updateProductInput,
    );
  }

  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => Int }) id: number) {
    return this.productService.removeProduct(id);
  }

  // @Mutation(() => Attribute)
  // addAttribute(
  //   @Args('addProductAttributeInput')
  //   addProductAttributeInput: AddProductAttributeDTO,
  // ) {
  //   return this.productService.addAttribute(
  //     addProductAttributeInput.productId,
  //     addProductAttributeInput,
  //   );
  // }

  @Mutation(() => ProductItem)
  addProductItem(
    @Args('addProductItemInput') addProductItemInput: AddProductItemDTO,
  ) {
    return this.productService.addProductItem(
      addProductItemInput.productId,
      addProductItemInput,
    );
  }

  @Mutation(() => ProductItem)
  updateProductItem(
    @Args('updateProductItemDTO') updateProductItemDTO: UpdateProductItemDTO,
  ) {
    return this.productService.updateProductItem(
      updateProductItemDTO.productId,
      updateProductItemDTO.productItemId,
      updateProductItemDTO,
    );
  }

  @Mutation(() => ProductItem)
  deleteProductItem(@Args('productItemId') productItemId: number) {
    return this.productService.deleteProductItem(productItemId);
  }

  @Mutation(() => Attribute)
  updateAttribute(
    @Args('updateProductAttributeInput')
    updateProductAttributeInput: UpdateProductAttributeDTO,
  ) {
    return this.productService.updateAttribute(
      updateProductAttributeInput.productId,
      updateProductAttributeInput.attributeId,
      updateProductAttributeInput,
    );
  }

  @Mutation(() => Attribute)
  removeAttribute(
    @Args('attributeId', { type: () => Int }) attributeId: number,
  ) {
    return this.productService.removeAttribute(attributeId);
  }

  @Mutation(() => Variation)
  updateVariation(
    @Args('updateVariationDTO')
    updateVariationDTO: UpdateVariationDTO,
  ) {
    return this.productService.updateVariation(
      updateVariationDTO.productId,
      updateVariationDTO.variationId,
      updateVariationDTO,
    );
  }

  @Mutation(() => VariationOption)
  updateVariationOption(
    @Args('updateVariationOptionDTO')
    updateVariationOptionDTO: UpdateVariationOptionDTO,
  ) {
    return this.productService.updateVariationOption(
      updateVariationOptionDTO.variationId,
      updateVariationOptionDTO.variationOptionId,
      updateVariationOptionDTO,
    );
  }

  @Mutation(() => VariationOption)
  addVariationOption(
    @Args('addVariationOptionDTO')
    addVariationOptionDTO: AddVariationOptionDTO,
  ) {
    return this.productService.addVariationOption(
      addVariationOptionDTO.variationId,
      addVariationOptionDTO,
    );
  }
}
