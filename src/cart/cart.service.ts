import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemInput } from './dto/create-cart.input';
import { ContextType } from 'src/unit/context-type';
import { CustomNotFoundException } from 'src/unit/not-found.exception';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(CartService.name);

  async addItemToCart(
    tx: Prisma.TransactionClient,
    cartId: number,
    itemId: number,
    qty: number,
  ) {
    const cartItem = await tx.cartItems.findFirst({
      where: { itemId },
    });

    if (cartItem) {
      return await tx.cartItems.update({
        where: { cartId_itemId: { cartId, itemId } },
        data: { qty: qty + cartItem.qty },
      });
    } else {
      const item = await tx.productItem.findUnique({
        where: {
          id: itemId,
        },
      });
      if (!item)
        throw new CustomNotFoundException(`item with this ${itemId} not found`);
      return await tx.cartItems.create({
        data: { cartId, itemId, qty, productId: item.productId },
      });
    }
  }

  async addItemsToCart(itemsWithQty: ItemInput[], context: ContextType) {
    const userId = context.req.user.id;

    return this.prisma.$transaction(async (tx) => {
      let cart = await tx.cart.findUnique({ where: { userId } });

      if (!cart) cart = await tx.cart.create({ data: { userId } });

      const items = await Promise.all(
        itemsWithQty.map(async (item) => {
          await this.addItemToCart(tx, cart.id, item.id, item.qty);
        }),
      );
      this.logger.log(items);
      return items;
    });
  }

  removeItem(itemId: number, context: ContextType) {
    const userId = context.req.user.id;

    return this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({ where: { userId } });
      const item = await tx.cartItems.findUnique({
        where: {
          cartId_itemId: {
            cartId: cart.id,
            itemId,
          },
        },
      });
      if (!item)
        throw new CustomNotFoundException(
          `item with this ${itemId} not found in your cart`,
        );

      return tx.cartItems.delete({
        where: {
          cartId_itemId: {
            cartId: cart.id,
            itemId,
          },
        },
      });
    });
  }

  removeAllItem(context: ContextType) {
    const userId = context.req.user.id;
    return this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (!cart)
        throw new CustomNotFoundException(`you don't Items in your cart`);
      const deletedItems = await this.prisma.cartItems.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      if (deletedItems.count === 0) {
        throw new CustomNotFoundException(
          `No items found in your cart to remove`,
        );
      }

      return deletedItems;
    });
  }

  getCart(context: ContextType) {
    const userId = context.req.user.id;
    return this.prisma.$transaction(async (tx) => {
      let cart = await tx.cart.findUnique({ where: { userId } });

      if (!cart) cart = await tx.cart.create({ data: { userId } });

      return tx.cart.findUnique({
        where: { id: cart.id },
        select: {
          cartItems: {
            select: {
              product: {
                select: {
                  id: true,
                  name: true,
                  coverImage: true,
                },
              },
              item: {
                select: {
                  price: true,
                  // productConfiguration: {
                  //   select: {
                  //     variationOption: {
                  //       select: {
                  //         value: true,
                  //       },
                  //     },
                  //   },
                  // },
                },
              },
              qty: true,
            },
          },
        },
      });
    });
  }

  updateCartItem(itemWithQty: ItemInput, context: ContextType) {
    const userId = context.req.user.id;
    return this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({ where: { userId } });
      const item = await tx.cartItems.findUnique({
        where: {
          cartId_itemId: {
            cartId: cart.id,
            itemId: itemWithQty.id,
          },
        },
      });
      if (!item)
        throw new CustomNotFoundException(
          `item with this ${itemWithQty.id} not found in your cart`,
        );
      return tx.cartItems.update({
        where: {
          cartId_itemId: {
            cartId: cart.id,
            itemId: itemWithQty.id,
          },
        },
        data: {
          qty: itemWithQty.qty,
        },
      });
    });
  }
}
