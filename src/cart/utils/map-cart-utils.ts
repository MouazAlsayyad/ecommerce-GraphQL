import { Cart, CartItem } from '../entities/cart.entity';

export async function groupCartItems(cart): Promise<Cart> {
  const groupedProducts = new Map();

  cart.cartItems.forEach((item) => {
    const productId = item.productId;

    if (groupedProducts.has(productId)) {
      groupedProducts.get(productId).item.push({
        id: item.item.id,
        qty: item.qty,
        price: item.item.price,
        productId: item.productId,
        variationsItem: item.item.productConfiguration.map((config) => ({
          value: config.variationOption.value,
        })),
      });
      groupedProducts.get(productId).price += item.qty * item.item.price;
    } else {
      groupedProducts.set(productId, {
        productId: item.productId,
        itemId: item.itemId,
        product: item.product,
        item: [
          {
            productId: item.productId,
            id: item.item.id,
            qty: item.qty,
            price: item.item.price,
            variationsItem: item.item.productConfiguration.map((config) => ({
              value: config.variationOption.value,
            })),
          },
        ],
        price: item.qty * item.item.price,
      });
    }
  });

  // groupedProducts.forEach((groupedProduct) => {
  //   result.push(groupedProduct);
  // });

  const cartItem: CartItem[] = Array.from(groupedProducts.values());

  const subtotal = cartItem.reduce((sum, item) => sum + item.price, 0);

  const result: Cart = {
    cartItem,
    subtotal,
  };

  return result;
}
