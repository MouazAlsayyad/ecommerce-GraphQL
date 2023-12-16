import { CartRepository, UseCase } from 'lib/types/src';
import { Cart } from '../entities/cart.entity';

export class GetCartUseCase implements UseCase<number, Promise<Cart[]>> {
  constructor(private cartRepository: CartRepository) {}

  execute(userId: number): Promise<Cart[]> {
    return this.cartRepository.getCart(userId);
  }
}
