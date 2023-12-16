import { Injectable } from '@nestjs/common';
import { PrismaCartRepository } from 'src/prisma/repositories';
import { AddItemCartInput } from './dto/create-cart.input';
import {
  AddItemToCartUseCase,
  EmptyTheShoppingCartUseCase,
  GetCartUseCase,
  RemoveItemFromCartUseCase,
  UpdateQtyOfItemCartUseCase,
} from './usecase';
import { UpdateItemCartInput } from './dto/update-cart.input';

@Injectable()
export class CartService {
  constructor(private cartRepository: PrismaCartRepository) {}

  addItemToCart(data: AddItemCartInput, userId: number) {
    const addItemToCartUseCase = new AddItemToCartUseCase(this.cartRepository);
    return addItemToCartUseCase.execute({ ...data, userId });
  }

  getCart(userId: number) {
    const getCartUseCase = new GetCartUseCase(this.cartRepository);
    return getCartUseCase.execute(userId);
  }

  emptyTheShoppingCart(userId: number) {
    const emptyTheShoppingCartUseCase = new EmptyTheShoppingCartUseCase(
      this.cartRepository,
    );
    return emptyTheShoppingCartUseCase.execute(userId);
  }

  removeItemFromCart(data: AddItemCartInput, userId: number) {
    const removeItemFromCartUseCase = new RemoveItemFromCartUseCase(
      this.cartRepository,
    );
    return removeItemFromCartUseCase.execute({ ...data, userId });
  }

  updateQtyOfItemCart(data: UpdateItemCartInput, userId: number) {
    const updateQtyOfItemCartUseCase = new UpdateQtyOfItemCartUseCase(
      this.cartRepository,
    );
    return updateQtyOfItemCartUseCase.execute({ ...data, userId });
  }
}
