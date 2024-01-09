import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Logger } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {}
  private readonly logger = new Logger(CategoryResolver.name);

  @Roles(UserType.ADMIN)
  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    try {
      return this.categoryService.create(createCategoryInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Query(() => [Category], { name: 'category' })
  findAll() {
    try {
      return this.categoryService.getAllCategories({});
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.categoryService.findOne(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Category)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    try {
      return this.categoryService.update(updateCategoryInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removeCategory(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.categoryService.remove(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @ResolveField()
  async product(@Parent() category: Category) {
    const { id } = category;
    return this.productService.findAll({ filter: { categoryId: id } });
  }
}
