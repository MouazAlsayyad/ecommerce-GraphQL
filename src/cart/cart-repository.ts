import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { groupCartItems } from './utils/map-cart-utils';
import {
  AddItemCartInput as ItemCartInput,
  RemoveCartItemInput,
} from './dto/create-cart.input';
import { Cart } from './entities/cart.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaCartRepository {
  constructor(private readonly prisma: PrismaService) {}

  addItemToCart(userId: number, data: ItemCartInput): Promise<boolean> {
    const { itemId, qty } = data;
    return this.prisma.$transaction(async (tx) => {
      let cart = await tx.cart.findUnique({ where: { userId } });

      if (!cart) cart = await tx.cart.create({ data: { userId } });
      const item = await tx.productItem.findUnique({ where: { id: itemId } });
      if (!item)
        throw new NotFoundException(`item with id ${itemId} not found`);

      await this.addItemsToCart(tx, cart.id, itemId, qty);

      return true;
    });
  }

  removeItem(userId: number, data: RemoveCartItemInput): Promise<void> {
    const { itemId } = data;
    return this.prisma.$transaction(async (tx) => {
      const { id } = await tx.cart.findUnique({ where: { userId } });
      const item = await tx.cartItems.findUnique({
        where: { cartId_itemId: { cartId: id, itemId } },
      });

      if (!item)
        throw new NotFoundException(
          `item with this ${itemId} not found in your cart`,
        );

      await tx.cartItems.delete({
        where: { cartId_itemId: { cartId: id, itemId } },
      });
      return;
    });
  }

  removeAllItemFromCart(userId: number): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      const { id } = await tx.cart.findUnique({ where: { userId } });
      if (!id) throw new NotFoundException(`you don't Items in your cart`);
      const deletedItems = await tx.cartItems.findMany({
        where: { cartId: id },
      });

      if (deletedItems.length === 0) {
        throw new NotFoundException(`No items found in your cart to remove`);
      }
      await tx.cartItems.deleteMany({ where: { cartId: id } });

      return;
    });
  }

  async getCart(userId: number): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: { select: { id: true, name: true, coverImage: true } },
            item: {
              select: {
                id: true,
                price: true,
                productConfiguration: {
                  select: { variationOption: { select: { value: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return {};
    }
    return groupCartItems(cart);
  }

  updateCartItem(userId: number, data: ItemCartInput): Promise<void> {
    const { itemId, qty } = data;
    return this.prisma.$transaction(async (tx) => {
      const { id } = await tx.cart.findUnique({ where: { userId } });
      const item = await tx.cartItems.findUnique({
        where: { cartId_itemId: { cartId: id, itemId } },
      });

      if (!item)
        throw new NotFoundException(
          `item with this ${itemId} not found in your cart`,
        );

      if (qty === 0) this.removeItem(userId, { itemId });
      const { qtyInStock } = await tx.productItem.findUnique({
        where: { id: itemId },
      });
      if (qty > qtyInStock)
        throw new BadRequestException(
          `Sorry, the order quantity is larger than what is available`,
        );
      await tx.cartItems.update({
        where: { cartId_itemId: { cartId: id, itemId } },
        data: { qty },
      });
    });
  }

  private async addItemsToCart(
    tx: Prisma.TransactionClient,
    cartId: number,
    itemId: number,
    qty: number,
  ) {
    const cartItem = await tx.cartItems.findFirst({
      where: { itemId },
    });
    const { qtyInStock } = await tx.productItem.findUnique({
      where: { id: itemId },
    });

    if (cartItem) {
      if (qty + cartItem.qty > qtyInStock)
        throw new BadRequestException(
          `Sorry, the order quantity is larger than what is available`,
        );
      return await tx.cartItems.update({
        where: { cartId_itemId: { cartId, itemId } },
        data: { qty: qty + cartItem.qty },
      });
    } else {
      if (qty > qtyInStock)
        throw new BadRequestException(
          `Sorry, the order quantity is larger than what is available`,
        );
      const item = await tx.productItem.findUnique({ where: { id: itemId } });
      if (!item)
        throw new NotFoundException(`item with this ${itemId} not found`);
      return await tx.cartItems.create({
        data: { cartId, itemId, qty, productId: item.productId },
      });
    }
  }
}
