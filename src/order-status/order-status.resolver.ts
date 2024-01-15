import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrderStatusService } from './order-status.service';
import { OrderStatus } from './entities/order-status.entity';
import { CreateOrderStatusInput } from './dto/create-order-status.input';
import { UpdateOrderStatusInput } from './dto/update-order-status.input';
import { Logger } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';

@Resolver(() => OrderStatus)
export class OrderStatusResolver {
  constructor(private readonly orderStatusService: OrderStatusService) {}
  private readonly logger = new Logger(OrderStatusResolver.name);

  @Roles(UserType.ADMIN)
  @Mutation(() => OrderStatus)
  createOrderStatus(
    @Args('createOrderStatusInput')
    createOrderStatusInput: CreateOrderStatusInput,
  ) {
    try {
      return this.orderStatusService.create(createOrderStatusInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Query(() => [OrderStatus], { name: 'orderStatus' })
  findAll() {
    try {
      return this.orderStatusService.findAll();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Query(() => OrderStatus, { name: 'orderStatus' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.orderStatusService.findOne(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => OrderStatus)
  updateOrderStatus(
    @Args('updateOrderStatusInput')
    updateOrderStatusInput: UpdateOrderStatusInput,
  ) {
    try {
      return this.orderStatusService.update(
        updateOrderStatusInput.id,
        updateOrderStatusInput,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => OrderStatus)
  removeOrderStatus(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.orderStatusService.remove(id);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
