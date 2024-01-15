import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ShoppingMethodService } from './shopping-method.service';
import { ShoppingMethod } from './entities/shopping-method.entity';
import { CreateShoppingMethodInput } from './dto/create-shopping-method.input';
import { UpdateShoppingMethodInput } from './dto/update-shopping-method.input';
import { Logger } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';

@Resolver(() => ShoppingMethod)
export class ShoppingMethodResolver {
  constructor(private readonly shoppingMethodService: ShoppingMethodService) {}
  private readonly logger = new Logger(ShoppingMethodResolver.name);

  @Roles(UserType.ADMIN)
  @Mutation(() => ShoppingMethod)
  createShoppingMethod(
    @Args('createShoppingMethodInput')
    createShoppingMethodInput: CreateShoppingMethodInput,
  ) {
    try {
      return this.shoppingMethodService.create(createShoppingMethodInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Query(() => [ShoppingMethod], { name: 'shoppingMethod' })
  findAll() {
    try {
      return this.shoppingMethodService.findAll();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Query(() => ShoppingMethod, { name: 'shoppingMethod' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.shoppingMethodService.findOne(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => ShoppingMethod)
  updateShoppingMethod(
    @Args('updateShoppingMethodInput')
    updateShoppingMethodInput: UpdateShoppingMethodInput,
  ) {
    try {
      return this.shoppingMethodService.update(
        updateShoppingMethodInput.id,
        updateShoppingMethodInput,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removeShoppingMethod(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.shoppingMethodService.remove(id);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
