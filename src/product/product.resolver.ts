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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { ReviewService } from 'src/review/review.service';
import { ProductItem } from './entities/item.entity';
import { Variation } from './entities/variation.entity';
import { TagService } from 'src/tag/tag.service';
import { Tag } from 'src/tag/entities/tag.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly reviewService: ReviewService,
    private readonly tagService: TagService,
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
    @Args('productFilterDTO', { type: () => ProductFilterDTO, nullable: true })
    productFilterDTO: ProductFilterDTO,
  ) {
    try {
      console.log(productFilterDTO);
      return this.productService.findAll(productFilterDTO);
    } catch (e) {
      this.logger.error(e);
    }
  }

  // @Query(() => [Product], { name: 'secondQuery' })
  // filter(
  //   @Args('inputParameter', { type: () => [Product], nullable: true })
  //   inputParameter: ProductFilterDTO[],
  // ) {
  //   try {
  //     console.log('Executing second query with parameter:', inputParameter);
  //     // You can use this.productService or any other service/method as needed
  //     // Return the result of the second query
  //     return []; // Replace with actual implementation
  //   } catch (e) {
  //     console.error(e);
  //     throw new Error('Unable to fetch data for the second query');
  //   }
  // }

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
  @Mutation(() => Boolean)
  removeProduct(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.productService.deleteProductById(id);
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
  @Mutation(() => Boolean)
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
  @Mutation(() => Boolean)
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
    try {
      return this.productService.addCategoryToProduct(productCategoryInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removeCategoryFromProduct(
    @Args('productCategoryInput')
    productCategoryInput: ProductCategoryInput,
  ) {
    try {
      return this.productService.removeCategoryFromProduct(
        productCategoryInput,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  addImagesToItem(
    @Args('addItemImagesInput')
    addItemImagesInput: AddItemImagesInput,
  ) {
    try {
      return this.productService.addImagesToItem(addItemImagesInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removeImageFromItem(
    @Args('ItemImageId')
    ItemImageId: number,
  ) {
    try {
      return this.productService.removeImageFromItem(ItemImageId);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Product)
  addImagesToProduct(
    @Args('addProductImagesInput')
    addProductImagesInput: AddProductImagesInput,
  ) {
    try {
      return this.productService.addImagesToProduct(addProductImagesInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removeImageFromProduct(
    @Args('productImageId')
    productImageId: number,
  ) {
    try {
      return this.productService.removeImageFromProduct(productImageId);
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
