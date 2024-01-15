import { Module } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { OrderStatusResolver } from './order-status.resolver';

@Module({
  providers: [OrderStatusResolver, OrderStatusService],
})
export class OrderStatusModule {}
