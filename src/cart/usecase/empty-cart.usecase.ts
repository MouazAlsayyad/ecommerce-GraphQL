import { CartRepository, UseCase } from 'lib/types/src';
import { Cart } from '../entities/cart.entity';

export class EmptyTheShoppingCartUseCase
  implements UseCase<number, Promise<Cart[]>>
{
  constructor(private cartRepository: CartRepository) {}

  execute(userId: number): Promise<Cart[]> {
    this.cartRepository.removeAllItemFromCart(userId);
    return this.cartRepository.getCart(userId);
  }
}
