import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { ItemInput } from './dto/create-cart.input';
import { ContextType } from 'src/unit/context-type';
import { Cart, CartItem } from './entities/cart.entity';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}
  // @Roles(UserType.USER)
  // @Mutation(() => [CartItem])
  // addItemsToCart(
  //   @Args('itemsWithQty', { type: () => [ItemInput] })
  //   itemsWithQty: ItemInput[],
  //   @Context() context: ContextType,
  // ) {
  //   return this.cartService.addItemsToCart(itemsWithQty, context);
  // }

  // @Roles(UserType.USER)
  // @Mutation(() => CartItem)
  // removeItemFromCart(
  //   @Args('itemId') itemId: number,
  //   @Context() context: ContextType,
  // ) {
  //   return this.cartService.removeItem(itemId, context);
  // }

  // @Roles(UserType.USER)
  // @Mutation(() => [CartItem])
  // removeAllItemFromCart(@Context() context: ContextType) {
  //   return this.cartService.removeAllItem(context);
  // }

  // @Roles(UserType.USER)
  // @Query(() => [Cart])
  // getCart(@Context() context: ContextType) {
  //   return this.cartService.getCart(context);
  // }

  // @Roles(UserType.USER)
  // @Mutation(() => CartItem)
  // updateCartItem(
  //   @Args('itemsWithQty', { type: () => ItemInput })
  //   itemsWithQty: ItemInput,
  //   @Context() context: ContextType,
  // ) {
  //   return this.cartService.updateCartItem(itemsWithQty, context);
  // }
}
