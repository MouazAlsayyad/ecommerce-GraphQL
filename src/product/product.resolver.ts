import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import {
  AddItemImagesInput,
  AddProductAttributeInput,
  AddProductImagesInput,
  AddProductItemInput,
  CreateProductInput,
  ProductCategoryInput,
  ProductFilterDTO,
  RemoveAttributeInput,
  RemoveItemImageInput,
  RemoveItemInput,
  RemoveProductImageInput,
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
import { TagService } from 'src/tag/tag.service';
import { Tag } from 'src/tag/entities/tag.entity';
import { ContextType } from 'src/unit/context-type';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly reviewService: ReviewService,
    private readonly tagService: TagService,
  ) {}
  private readonly logger = new Logger(ProductResolver.name);

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.create(
        createProductInput,
        context.req.user.id,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Query(() => [Product], { name: 'products' })
  findAll(
    @Args('productFilterDTO', { type: () => ProductFilterDTO, nullable: true })
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

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.update(
        updateProductInput,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Boolean)
  removeProduct(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.deleteProductById(
        id,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Product)
  addProductItem(
    @Args('addProductItemInput') addProductItemInput: AddProductItemInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.addProductItem(
        addProductItemInput,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Product)
  updateProductItem(
    @Args('updateProductItemInput')
    updateProductItemInput: UpdateProductItemInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.updateProductItem(
        updateProductItemInput,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Boolean)
  deleteProductItem(
    @Args('removeItemInput', { type: () => RemoveItemInput })
    removeItemInput: RemoveItemInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.deleteProductItem(
        removeItemInput.itemId,
        removeItemInput.productId,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Product)
  addAttribute(
    @Args('addProductAttributeInput')
    addProductAttributeInput: AddProductAttributeInput,
    @Context() context: ContextType,
  ) {
    return this.productService.addAttribute(
      addProductAttributeInput,
      context.req.user.id,
      context.req.user.user_type,
    );
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Product)
  updateAttribute(
    @Args('updateProductAttributeInput')
    updateProductAttributeInput: UpdateProductAttributeInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.updateAttribute(
        updateProductAttributeInput,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Boolean)
  removeAttribute(
    @Args('removeAttributeInput', { type: () => RemoveAttributeInput })
    removeAttributeInput: RemoveAttributeInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.removeAttribute(
        removeAttributeInput.attributeId,
        removeAttributeInput.productId,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Product)
  updateVariationOption(
    @Args('updateVariationOptionInput')
    updateVariationOptionInput: UpdateVariationOptionInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.updateVariationOption(
        updateVariationOptionInput,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Product)
  updateVariation(
    @Args('updateVariationInput')
    updateVariationInput: UpdateVariationInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.updateVariation(
        updateVariationInput,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Product)
  addCategoryToProduct(
    @Args('productCategoryInput')
    productCategoryInput: ProductCategoryInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.addCategoryToProduct(
        productCategoryInput,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Boolean)
  removeCategoryFromProduct(
    @Args('productCategoryInput')
    productCategoryInput: ProductCategoryInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.removeCategoryFromProduct(
        productCategoryInput,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Product)
  addImagesToItem(
    @Args('addItemImagesInput')
    addItemImagesInput: AddItemImagesInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.addImagesToItem(
        addItemImagesInput,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Boolean)
  removeImageFromItem(
    @Args('removeItemImageInput')
    removeItemImageInput: RemoveItemImageInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.removeImageFromItem(
        removeItemImageInput.ItemImageId,
        removeItemImageInput.productId,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Product)
  addImagesToProduct(
    @Args('addProductImagesInput')
    addProductImagesInput: AddProductImagesInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.addImagesToProduct(
        addProductImagesInput,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Boolean)
  removeImageFromProduct(
    @Args('removeProductImageInput')
    removeProductImageInput: RemoveProductImageInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.productService.removeImageFromProduct(
        removeProductImageInput,
        context.req.user.id,
        context.req.user.user_type,
      );
    } catch (e) {
      this.logger.error(e);
    }
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
  productTag(@Parent() product: Product) {
    const { id } = product;
    return this.tagService.findAllTagsByProductId(id);
  }

  @ResolveField()
  async relatedProducts(@Parent() product: Product) {
    let tags: Tag[];
    if (product?.productTag) tags = product.productTag;
    else tags = await this.tagService.findAllTagsByProductId(product.id);
    return this.productService.findRelatedProducts(
      tags.map((tag) => {
        return tag.id;
      }),
      product.id,
    );
  }

  @ResolveField()
  attributes(@Parent() product: Product) {
    const { id } = product;
    return this.productService.getAttributesByProductId(id);
  }

  @ResolveField()
  productImage(@Parent() product: Product) {
    const { id } = product;
    return this.productService.getImagesByProductId(id);
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
