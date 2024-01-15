import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreatePaymentInput): Promise<Payment> {
    return this.prisma.paymentOption.create({ data });
  }

  findAll(): Promise<Payment[]> {
    return this.prisma.paymentOption.findMany();
  }

  findOne(id: number): Promise<Payment> {
    return this.prisma.paymentOption.findUnique({ where: { id } });
  }

  update(id: number, data: UpdatePaymentInput): Promise<Payment> {
    return this.prisma.paymentOption.update({
      where: { id },
      data: { name: data.name },
    });
  }

  async remove(id: number): Promise<boolean> {
    const order = await this.prisma.order.findFirst({
      where: { AND: [{ paymentOptionId: id }] },
    });
    if (order)
      throw new BadRequestException(
        `There are orders that use this payment option`,
      );
    await this.prisma.paymentOption.delete({ where: { id } });
    return true;
  }
}
