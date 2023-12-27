import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { PrismaCartRepository } from './cart-repository';

@Module({
  providers: [
    CartResolver,
    CartService,
    PrismaCartRepository,
    JwtService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class CartModule {}
