import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BrandService } from './brand.service';
import { Brand } from './entities/brand.entity';
import {
  AddCategoriesToBrandInput,
  CreateBrandInput,
  RemoveCategoryFromBrandInput,
} from './dto/create-brand.input';
import { UpdateBrandInput } from './dto/update-brand.input';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Resolver(() => Brand)
export class BrandResolver {
  constructor(private readonly brandService: BrandService) {}
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
  findAll() {
    try {
      return this.brandService.findAll();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Query(() => Brand, { name: 'brand' })
  findOne(@Args('id', { type: () => Int }) id: number) {
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
  @Mutation(() => Brand)
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
  @Mutation(() => Brand)
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
}
