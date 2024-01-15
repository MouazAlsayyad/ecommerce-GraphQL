import { Injectable } from '@nestjs/common';
import { CreateOrderStatusInput } from './dto/create-order-status.input';
import { UpdateOrderStatusInput } from './dto/update-order-status.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderStatusService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateOrderStatusInput) {
    return this.prisma.orderStatus.create({ data });
  }

  findAll() {
    return this.prisma.orderStatus.findMany();
  }

  findOne(id: number) {
    return this.prisma.orderStatus.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateOrderStatusInput) {
    return this.prisma.orderStatus.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.prisma.orderStatus.delete({ where: { id } });
    return true;
  }
}
