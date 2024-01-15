import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { Logger } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}
  private readonly logger = new Logger(PaymentResolver.name);

  @Roles(UserType.ADMIN)
  @Mutation(() => Payment)
  createPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ) {
    try {
      return this.paymentService.create(createPaymentInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Query(() => [Payment], { name: 'payments' })
  findAll() {
    try {
      return this.paymentService.findAll();
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Query(() => Payment, { name: 'payment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.paymentService.findOne(id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Payment)
  updatePayment(
    @Args('updatePaymentInput') updatePaymentInput: UpdatePaymentInput,
  ) {
    try {
      return this.paymentService.update(
        updatePaymentInput.id,
        updatePaymentInput,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.ADMIN)
  @Mutation(() => Boolean)
  removePayment(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.paymentService.remove(id);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
