import { CartRepository, UseCase } from 'lib/types/src';
import { UpdateItemCartInput } from '../dto/update-cart.input';
import { Cart } from '../entities/cart.entity';

export class UpdateQtyOfItemCartUseCase
  implements UseCase<UpdateItemCartInput, Promise<Cart[]>>
{
  constructor(private cartRepository: CartRepository) {}

  execute(data: UpdateItemCartInput & { userId: number }): Promise<Cart[]> {
    this.cartRepository.updateCartItem(data);
    return this.cartRepository.getCart(data.userId);
  }
}
