import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { ReviewService } from 'src/review/review.service';
import { ProductItem } from './entities/item.entity';
import { Variation } from './entities/variation.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly reviewService: ReviewService,
  ) {}
  private readonly logger = new Logger(ProductResolver.name);

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    try {
      return this.productService.create(createProductInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Query(() => [Product], { name: 'products' })
  findAll(
    @Args('productFilterDTO', { nullable: true })
    productFilterDTO: ProductFilterDTO,
  ) {
    try {
      return this.productService.findAll(productFilterDTO);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.productService.findOne(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    try {
      return this.productService.update(updateProductInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.productService.remove(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  addProductItem(
    @Args('addProductItemInput') addProductItemInput: AddProductItemInput,
  ) {
    try {
      return this.productService.addProductItem(addProductItemInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  updateProductItem(
    @Args('updateProductItemInput')
    updateProductItemInput: UpdateProductItemInput,
  ) {
    try {
      return this.productService.updateProductItem(updateProductItemInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  deleteProductItem(@Args('itemId', { type: () => Int }) itemId: number) {
    try {
      return this.productService.deleteProductItem(itemId);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Mutation(() => Product)
  addAttribute(
    @Args('addProductAttributeInput')
    addProductAttributeInput: AddProductAttributeInput,
  ) {
    return this.productService.addAttribute(addProductAttributeInput);
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  updateAttribute(
    @Args('updateProductAttributeInput')
    updateProductAttributeInput: UpdateProductAttributeInput,
  ) {
    try {
      return this.productService.updateAttribute(updateProductAttributeInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  removeAttribute(
    @Args('attributeId', { type: () => Int }) attributeId: number,
  ) {
    try {
      return this.productService.removeAttribute(attributeId);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  addVariationOption(
    @Args('addVariationOptionInput')
    addVariationOptionInput: AddVariationOptionInput,
  ) {
    try {
      return this.productService.addVariationOption(addVariationOptionInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  updateVariationOption(
    @Args('updateVariationOptionInput')
    updateVariationOptionInput: UpdateVariationOptionInput,
  ) {
    try {
      return this.productService.updateVariationOption(
        updateVariationOptionInput,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  updateVariation(
    @Args('updateVariationInput')
    updateVariationInput: UpdateVariationInput,
  ) {
    try {
      return this.productService.updateVariation(updateVariationInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  addCategoryToProduct(
    @Args('productCategoryInput')
    productCategoryInput: ProductCategoryInput,
  ) {
    return this.productService.addCategoryToProduct(productCategoryInput);
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  removeCategoryFromProduct(
    @Args('productCategoryInput')
    productCategoryInput: ProductCategoryInput,
  ) {
    return this.productService.removeCategoryFromProduct(productCategoryInput);
  }

  @ResolveField()
  category(@Parent() product: Product) {
    const { id } = product;
    return this.productService.getProductCategories(id);
  }

  @ResolveField()
  userReview(@Parent() product: Product) {
    const { id } = product;
    return this.reviewService.getAllReviewsByProductId(id);
  }

  @ResolveField()
  attributes(@Parent() product: Product) {
    const { id } = product;
    return this.productService.getAttributesByProductId(id);
  }

  @ResolveField(() => [ProductItem])
  productItem(@Parent() product: Product) {
    const { id } = product;
    return this.productService.getProductItemsByProductId(id);
  }

  @ResolveField(() => [Variation])
  variation(@Parent() product: Product) {
    const { id } = product;
    return this.productService.getVariationByProductId(id);
  }
}
