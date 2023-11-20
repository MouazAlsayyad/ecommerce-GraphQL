import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemInput } from './dto/create-cart.input';
import { ContextType } from 'src/unit/context-type';
import { CustomNotFoundException } from 'src/unit/not-found.exception';
import { Prisma } from '@prisma/client';
import { Cart } from './entities/cart.entity';

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

      return await Promise.all(
        itemsWithQty.map(async (item) => {
          return await this.addItemToCart(tx, cart.id, item.id, item.qty);
        }),
      );
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
      const deletedItems = await tx.cartItems.findMany({
        where: {
          cartId: cart.id,
        },
      });
      await tx.cartItems.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      if (deletedItems.length === 0) {
        throw new CustomNotFoundException(
          `No items found in your cart to remove`,
        );
      }

      return deletedItems;
    });
  }

  // async getCart(context: ContextType) {
  //   const userId = context.req.user.id;

  //   const cart = await this.prisma.$transaction(async (tx) => {
  //     let existingCart = await tx.cart.findUnique({ where: { userId } });

  //     if (!existingCart) {
  //       existingCart = await tx.cart.create({ data: { userId } });
  //     }

  //     const result = await tx.cart.findUnique({
  //       where: { id: existingCart.id },
  //       select: {
  //         cartItems: {
  //           select: {
  //             product: {
  //               select: {
  //                 id: true,
  //                 name: true,
  //                 coverImage: true,
  //               },
  //             },
  //             item: {
  //               select: {
  //                 price: true,
  //               },
  //             },
  //             // qty: true,
  //           },
  //         },
  //       },
  //     });

  //     // Handle the case where the result or qty might be null
  //     return result ? [result] : null;
  //   });

  //   return cart;
  // }

  async getCart(context: ContextType): Promise<Cart[]> {
    const userId = context.req.user.id;
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                coverImage: true,
              },
            },
            item: {
              select: {
                id: true,
                price: true,
                productConfiguration: {
                  select: {
                    variationOption: {
                      select: {
                        value: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!cart) {
      return [];
    }
    return this.groupCartItems(cart);
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

  private groupCartItems(cart): Cart[] {
    const groupedProducts = new Map();

    cart.cartItems.forEach((item) => {
      const productId = item.productId;

      if (groupedProducts.has(productId)) {
        groupedProducts.get(productId).item.push({
          id: item.item.id,
          qty: item.qty,
          price: item.item.price,
          variationsItem: item.item.productConfiguration.map((config) => ({
            value: config.variationOption.value,
          })),
        });
      } else {
        groupedProducts.set(productId, {
          productId: item.productId,
          itemId: item.itemId,
          product: item.product,
          item: [
            {
              id: item.item.id,
              qty: item.qty,
              price: item.item.price,
              variationsItem: item.item.productConfiguration.map((config) => ({
                value: config.variationOption.value,
              })),
            },
          ],
        });
      }
    });

    const result: Cart[] = [];

    groupedProducts.forEach((groupedProduct) => {
      result.push(groupedProduct);
    });
    this.logger.log(result);

    return [];
  }
}
