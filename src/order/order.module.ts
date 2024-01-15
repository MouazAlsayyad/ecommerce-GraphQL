import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { CartService } from 'src/cart/cart.service';
import { PrismaCartRepository } from 'src/cart/cart-repository';

@Module({
  providers: [CartService, OrderResolver, OrderService, PrismaCartRepository],
})
export class OrderModule {}
