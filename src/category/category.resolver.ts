import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Logger } from '@nestjs/common';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}
  private readonly logger = new Logger(CategoryResolver.name);

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
      return this.categoryService.findAll();
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

  @Mutation(() => Category)
  removeCategory(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.categoryService.remove(id);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
