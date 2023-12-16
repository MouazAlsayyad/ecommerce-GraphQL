import { CartEntity } from '../entities/cart-entity.interface';
import { CartItemDTO, RemoveCartItemDTO } from '../dtos/cart-dto.interface';

export interface CartRepository {
  addItemToCart(data: CartItemDTO): Promise<void>;
  removeItem(data: RemoveCartItemDTO): Promise<void>;
  removeAllItemFromCart(userId: number): Promise<void>;
  getCart(userId: number): Promise<CartEntity[]>;
  updateCartItem(data: CartItemDTO): Promise<void>;
}
