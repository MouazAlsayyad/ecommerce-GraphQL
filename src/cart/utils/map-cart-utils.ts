import { Cart } from '../entities/cart.entity';

export async function groupCartItems(cart): Promise<Cart[]> {
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

  return result;
}
