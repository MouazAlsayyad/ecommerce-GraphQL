import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BrandService } from './brand.service';
import { Brand } from './entities/brand.entity';
import {
  AddCategoriesToBrandInput,
  BrandFilter,
  CreateBrandInput,
  RemoveCategoryFromBrandInput,
} from './dto/create-brand.input';
import { UpdateBrandInput } from './dto/update-brand.input';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';

@Resolver(() => Brand)
export class BrandResolver {
  constructor(
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
  ) {}
  private readonly logger = new Logger(BrandResolver.name);

  @Roles(UserType.ADMIN)
  @Mutation(() => Brand)
  createBrand(@Args('createBrandInput') createBrandInput: CreateBrandInput) {
    try {
      return this.brandService.create(createBrandInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Query(() => [Brand], { name: 'brands' })
  findAllBrand(
    @Args('brandFilter', { type: () => BrandFilter, nullable: true })
    brandFilter: BrandFilter,
  ) {
    try {
      return this.brandService.findAll(brandFilter);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Query(() => Brand, { name: 'brand' })
  findBrandById(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.brandService.findOne(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Brand)
  updateBrand(@Args('updateBrandInput') updateBrandInput: UpdateBrandInput) {
    try {
      return this.brandService.update(updateBrandInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removeBrand(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.brandService.remove(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Brand)
  addCategoriesToBrand(
    @Args('addCategoriesToBrandInput')
    addCategoriesToBrandInput: AddCategoriesToBrandInput,
  ) {
    try {
      return this.brandService.addCategoriesToBrand(addCategoriesToBrandInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removeCategoryFromBrand(
    @Args('removeCategoryFromBrandInput')
    removeCategoryFromBrandInput: RemoveCategoryFromBrandInput,
  ) {
    try {
      return this.brandService.removeCategoryFromBrand(
        removeCategoryFromBrandInput,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @ResolveField()
  async category(@Parent() brand: Brand) {
    const { id } = brand;
    return this.categoryService.getAllCategories({ brandId: id });
  }
}
