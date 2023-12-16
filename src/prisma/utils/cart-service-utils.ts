import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CartEntity, CartItemEntity } from 'lib/types/src';

export async function addItemToCart(
  tx: Prisma.TransactionClient,
  cartId: number,
  itemId: number,
  qty: number,
): Promise<CartItemEntity> {
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

export async function groupCartItems(cart): Promise<CartEntity[]> {
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

  const result: CartEntity[] = [];

  groupedProducts.forEach((groupedProduct) => {
    result.push(groupedProduct);
  });

  return result;
}
