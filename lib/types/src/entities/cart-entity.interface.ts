export class CartItemEntity {
  productId: number;
  itemId: number;
  cartId: number;
  qty: number;
}

class VariationsItemEntity {
  value: string;
}

class ItemWithQtyEntity {
  id: number;
  qty: number;
  price: number;
  variationsItem: VariationsItemEntity[];
}

class ProductTypeEntity {
  id: number;
  name: string;
  coverImage: string;
}

export class CartEntity {
  product: ProductTypeEntity;
  item: ItemWithQtyEntity[];
}
