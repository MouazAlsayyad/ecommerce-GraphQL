import { Injectable } from '@nestjs/common';

import { AddItemCartInput } from './dto/create-cart.input';

import { UpdateItemCartInput } from './dto/update-cart.input';
import { Cart } from './entities/cart.entity';
import { PrismaCartRepository } from './cart-repository';

@Injectable()
export class CartService {
  constructor(private cartRepository: PrismaCartRepository) {}

  async addItemToCart(data: AddItemCartInput, userId: number): Promise<Cart[]> {
    await this.cartRepository.addItemToCart(userId, { ...data });
    return this.cartRepository.getCart(userId);
  }

  getCart(userId: number): Promise<Cart[]> {
    return this.cartRepository.getCart(userId);
  }

  async emptyTheShoppingCart(userId: number) {
    await this.cartRepository.removeAllItemFromCart(userId);
    return this.cartRepository.getCart(userId);
  }

  async removeItemFromCart(data: AddItemCartInput, userId: number) {
    await this.cartRepository.removeItem(userId, { ...data });
    return this.cartRepository.getCart(userId);
  }

  async updateQtyOfItemCart(data: UpdateItemCartInput, userId: number) {
    await this.cartRepository.updateCartItem(userId, { ...data });
    return this.cartRepository.getCart(userId);
  }
}
