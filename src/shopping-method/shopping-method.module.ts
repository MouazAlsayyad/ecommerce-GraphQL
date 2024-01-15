import { Module } from '@nestjs/common';
import { ShoppingMethodService } from './shopping-method.service';
import { ShoppingMethodResolver } from './shopping-method.resolver';

@Module({
  providers: [ShoppingMethodResolver, ShoppingMethodService],
})
export class ShoppingMethodModule {}
