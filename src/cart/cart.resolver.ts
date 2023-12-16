import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { AddItemCartInput } from './dto/create-cart.input';
import { ContextType } from 'src/unit/context-type';
import { UpdateItemCartInput } from './dto/update-cart.input';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}
  private readonly logger = new Logger(CartResolver.name);

  @Roles(UserType.USER, UserType.ADMIN)
  @Mutation(() => [Cart])
  addItemToCart(
    @Args('addItemCartInput') addItemCartInput: AddItemCartInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.cartService.addItemToCart(
        addItemCartInput,
        context.req.user.id,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Query(() => [Cart], { name: 'cart' })
  getCart(@Context() context: ContextType) {
    try {
      return this.cartService.getCart(context.req.user.id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Mutation(() => [Cart])
  removeItemFromCart(
    @Args('addItemCartInput') addItemCartInput: AddItemCartInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.cartService.removeItemFromCart(
        addItemCartInput,
        context.req.user.id,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Mutation(() => [Cart])
  updateCart(
    @Args('updateItemCartInput') updateItemCartInput: UpdateItemCartInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.cartService.updateQtyOfItemCart(
        updateItemCartInput,
        context.req.user.id,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Mutation(() => [Cart])
  emptyTheShoppingCart(@Context() context: ContextType) {
    try {
      return this.cartService.emptyTheShoppingCart(context.req.user.id);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
