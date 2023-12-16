import { CartRepository, UseCase } from 'lib/types/src';
import { AddItemCartInput } from '../dto/create-cart.input';
import { Cart } from '../entities/cart.entity';

export class RemoveItemFromCartUseCase
  implements UseCase<AddItemCartInput, Promise<Cart[]>>
{
  constructor(private cartRepository: CartRepository) {}

  execute(data: AddItemCartInput & { userId: number }): Promise<Cart[]> {
    this.cartRepository.removeItem(data);
    return this.cartRepository.getCart(data.userId);
  }
}
