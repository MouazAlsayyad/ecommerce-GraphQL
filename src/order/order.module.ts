import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { CartService } from 'src/cart/cart.service';
import { PrismaCartRepository } from 'src/cart/cart-repository';
import { TaxService } from 'src/tax/tax.service';
import { PaymentService } from 'src/payment/payment.service';
import { ShoppingMethodService } from 'src/shopping-method/shopping-method.service';
import { UserService } from 'src/user/user.service';
import { PrismaUserRepository } from 'src/user/user-repository';

@Module({
  providers: [
    TaxService,
    CartService,
    OrderResolver,
    OrderService,
    PrismaCartRepository,
    PaymentService,
    ShoppingMethodService,
    PrismaUserRepository,
    UserService,
  ],
})
export class OrderModule {}
