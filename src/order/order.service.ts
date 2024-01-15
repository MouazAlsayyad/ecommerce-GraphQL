import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartService } from 'src/cart/cart.service';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
  ) {}
  async create(data: CreateOrderInput, userId: number): Promise<boolean> {
    const {
      email,
      name,
      paymentOptionId,
      phone,
      shippingAddress,
      shoppingMethodId,
    } = data;
    const cart = await this.cartService.getCart(userId);
    // await this.prisma.order.create({data:{
    //   name,email,phone,shippingAddress,subTotal,total,orderTax:{

    //   },paymentOptionId,shoppingMethodId,statusId,orderItem,userId,
    // }})
    console.log(cart.subtotal);
    return true;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderInput: UpdateOrderInput) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
