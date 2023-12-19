import { Injectable } from '@nestjs/common';
import { PrismaCartRepository } from 'src/prisma/repositories';
import { AddItemCartInput } from './dto/create-cart.input';

import { UpdateItemCartInput } from './dto/update-cart.input';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(private cartRepository: PrismaCartRepository) {}

  async addItemToCart(data: AddItemCartInput, userId: number): Promise<Cart[]> {
    await this.cartRepository.addItemToCart({ ...data, userId });
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
    await this.cartRepository.removeItem({ ...data, userId });
    return this.cartRepository.getCart(userId);
  }

  async updateQtyOfItemCart(data: UpdateItemCartInput, userId: number) {
    await this.cartRepository.updateCartItem({ ...data, userId });
    return this.cartRepository.getCart(userId);
  }
}
