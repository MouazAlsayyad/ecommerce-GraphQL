import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order, OrderItem } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { ContextType } from 'src/unit/context-type';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { Tax } from 'src/tax/entities/tax.entity';
import { TaxService } from 'src/tax/tax.service';
import { PaymentService } from 'src/payment/payment.service';
import { Payment } from 'src/payment/entities/payment.entity';
import { ShoppingMethodService } from 'src/shopping-method/shopping-method.service';
import { ShoppingMethod } from 'src/shopping-method/entities/shopping-method.entity';
import { UserService } from 'src/user/user.service';
import { Address } from 'src/user/entities/address.entity';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly taxService: TaxService,
    private readonly paymentService: PaymentService,
    private readonly shoppingMethodService: ShoppingMethodService,
    private readonly userService: UserService,
  ) {}

  @Roles(UserType.ADMIN, UserType.SELLER, UserType.USER)
  @Mutation(() => Boolean)
  createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @Context() context: ContextType,
  ) {
    return this.orderService.createOrder(createOrderInput, context.req.user.id);
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Query(() => [Order], { name: 'orders' })
  findAll(@Context() context: ContextType) {
    return this.orderService.findAll(
      context.req.user.id,
      context.req.user.user_type,
    );
  }

  @Roles(UserType.ADMIN, UserType.SELLER, UserType.USER)
  @Query(() => [Order], { name: 'orders' })
  getMyOrders(@Context() context: ContextType) {
    return this.orderService.findAll(
      context.req.user.id,
      context.req.user.user_type,
    );
  }

  @Roles(UserType.ADMIN, UserType.SELLER, UserType.USER)
  @Query(() => Order, { name: 'order' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: ContextType,
  ) {
    return this.orderService.findOne(
      id,
      context.req.user.id,
      context.req.user.user_type,
    );
  }

  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => Order)
  updateOrder(
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
    @Context() context: ContextType,
  ) {
    return this.orderService.updateOrderById(
      updateOrderInput.id,
      updateOrderInput,

      context.req.user.user_type,
    );
  }
  @Roles(UserType.ADMIN)
  @Mutation(() => Order)
  removeOrder(@Args('id', { type: () => Int }) id: number) {
    return this.orderService.removeOrderById(id);
  }

  @Roles(UserType.ADMIN, UserType.SELLER, UserType.USER)
  @Mutation(() => Order)
  cancelOrderById(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: ContextType,
  ) {
    return this.orderService.cancelOrderById(
      id,
      context.req.user.id,
      context.req.user.user_type,
    );
  }

  @ResolveField(() => [OrderItem])
  orderItem(@Parent() order: Order) {
    const { id } = order;
    return this.orderService.getOrderItemByOrderId(id);
  }

  @ResolveField(() => Tax)
  tax(@Parent() order: Order) {
    const { taxId } = order;
    if (taxId) return this.taxService.findOne(taxId);
    else return null;
  }

  @ResolveField(() => Payment)
  paymentOption(@Parent() order: Order) {
    const { paymentOptionId } = order;
    if (paymentOptionId) return this.paymentService.findOne(paymentOptionId);
    else return null;
  }

  @ResolveField(() => ShoppingMethod)
  shoppingMethod(@Parent() order: Order) {
    const { shoppingMethodId } = order;
    if (shoppingMethodId)
      return this.shoppingMethodService.findOne(shoppingMethodId);
    else return null;
  }

  @ResolveField(() => Address)
  address(@Parent() order: Order) {
    const { addressId } = order;
    return this.userService.getAddressById(addressId);
  }

  @ResolveField(() => User)
  user(@Parent() order: Order) {
    const { userId } = order;
    return this.userService.findUserById(userId);
  }
}
