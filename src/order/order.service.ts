import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartService } from 'src/cart/cart.service';
import { Address } from 'src/user/entities/address.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { OrderStatus, Prisma, UserType } from '@prisma/client';
import { Order, OrderItem } from './entities/order.entity';
import { ForbiddenError } from '@nestjs/apollo';
import { OrderFilterDTO, OrdersOrderBy } from './dto/filter-user.input';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
  ) {}
  async createOrder(data: CreateOrderInput, userId: number): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const { email, name, phone, paymentOptionId, shoppingMethodId } = data;
      let address: Address;
      if (data.addressId)
        address = await tx.address.findUnique({
          where: { id: data.addressId, userId },
        });
      else if (data.shippingAddress) {
        const CreateAddress = { userId, ...data.shippingAddress };
        address = await tx.address.create({
          data: CreateAddress,
        });
      } else throw new BadRequestException('Enter your address');

      const cart: Cart = await this.cartService.getCart(userId);
      const orderItemData: {
        price: number;
        productId: number;
        productItemId: number;
        qty: number;
      }[] = cart.cartItem.flatMap((items) => {
        return items.item.map((item) => ({
          price: item.price,
          productId: item.productId,
          productItemId: item.id,
          qty: item.qty,
        }));
      });
      const subTotal = cart.subtotal;
      const shoppingMethod = await tx.shoppingMethod.findUnique({
        where: { id: data.shoppingMethodId },
      });
      const tax = await tx.tax.findFirst({
        where: {
          AND: [
            { active: true },
            { countryId: address.countryId },
            { stateId: address.stateId },
          ],
        },
      });

      const taxes = tax?.taxRate
        ? subTotal * (tax.taxRate / 100)
        : subTotal * 0.05;

      const total = subTotal + taxes + shoppingMethod.price;
      await tx.order.create({
        data: {
          email,
          name,
          phone,
          subTotal,
          taxes,
          total,
          paymentOptionId,
          shoppingMethodId,
          addressId: address.id,
          userId,
          orderItem: {
            createMany: {
              data: orderItemData,
            },
          },
          taxId: tax?.id,
        },
      });
      await this.cartService.emptyTheShoppingCart(userId);
      return true;
    });
  }

  async findAll(
    orderFilterDTO: OrderFilterDTO,
    userId: number,
    userType: UserType,
  ): Promise<Order[]> {
    const orderBy: Prisma.OrderOrderByWithRelationInput = {
      ...(orderFilterDTO?.orderBy === OrdersOrderBy.HighestToLowest && {
        total: 'desc',
      }),
      ...(orderFilterDTO?.orderBy === OrdersOrderBy.LowestToHighest && {
        total: 'asc',
      }),
      ...(orderFilterDTO?.orderBy === OrdersOrderBy.NewOrder && {
        createdAt: 'desc',
      }),
      ...(orderFilterDTO?.orderBy === OrdersOrderBy.OldOrder && {
        createdAt: 'asc',
      }),
    };

    const where: Prisma.OrderWhereInput = {
      ...(orderFilterDTO?.filter?.email && {
        email: { contains: orderFilterDTO.filter.email },
      }),
      ...(orderFilterDTO?.filter?.name && {
        name: { contains: orderFilterDTO.filter.name },
      }),
      ...(orderFilterDTO?.filter?.phone_number && {
        phone: { contains: orderFilterDTO.filter.phone_number },
      }),
      ...(orderFilterDTO?.filter?.status && {
        status: orderFilterDTO.filter.status,
      }),
    };

    // skip: cursor ? 1 : 0,
    // cursor: cursor ? { id: cursor } : undefined,
    // take,

    if (userType === UserType.SELLER) {
      const products = await this.prisma.product.findMany({
        where: { userId },
        select: { id: true },
      });
      const productsIds = products.map((product) => {
        return product.id;
      });
      const whereOrder: Prisma.OrderWhereInput = {
        ...where,
        orderItem: { some: { productId: { in: productsIds } } },
      };
      return this.prisma.order.findMany({
        where: whereOrder,
        orderBy,
        skip: orderFilterDTO?.skip ? orderFilterDTO.skip : 0,
        cursor: orderFilterDTO.skip ? { id: orderFilterDTO.skip } : undefined,
        take: orderFilterDTO?.take ? orderFilterDTO?.take : 10,
      });
    } else
      return this.prisma.order.findMany({
        where,
        orderBy,
        skip: orderFilterDTO?.skip ? orderFilterDTO.skip : 0,
        cursor: orderFilterDTO.skip ? { id: orderFilterDTO.skip } : undefined,
        take: orderFilterDTO?.take ? orderFilterDTO?.take : 10,
      });
  }

  getMyOrders(userId: number) {
    return this.prisma.order.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number, userType: UserType) {
    if (userType === UserType.ADMIN) {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) throw new NotFoundException(`order with id ${id} not found`);
      return order;
    } else if (userType === UserType.SELLER) {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { orderItem: true },
      });
      if (!order) throw new NotFoundException(`order with id ${id} not found`);
      const productsIds = order.orderItem.map((item) => {
        return item.productId;
      });
      const product = await this.prisma.product.findFirst({
        where: { userId, id: { in: productsIds } },
      });

      if (!product) throw new ForbiddenError('Forbidden resource');
      return order;
    }
    if (userType === UserType.USER) {
      const order = await this.prisma.order.findUnique({
        where: { id, userId },
      });
      if (!order) throw new NotFoundException(`order with id ${id} not found`);
      return order;
    }
  }

  async updateOrderById(
    id: number,
    data: UpdateOrderInput,

    userType: UserType,
  ): Promise<Order> {
    if (userType === UserType.ADMIN) {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { orderItem: true },
      });
      if (!order) throw new NotFoundException(`order with id ${id} not found`);
      return this.prisma.order.update({
        where: { id },
        data: { status: data.status },
      });
    } else if (userType === UserType.SELLER) {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { orderItem: true },
      });
      if (!order) throw new NotFoundException(`order with id ${id} not found`);
      const productsIds = order.orderItem.map((item) => {
        return item.productId;
      });
      const product = await this.prisma.product.findFirst({
        where: { id: { in: productsIds } },
      });
      if (!product) throw new ForbiddenError('Forbidden resource');
      return this.prisma.order.update({
        where: { id },
        data: { status: data.status },
      });
    }
  }

  async cancelOrderById(id: number, userId: number, userType: UserType) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItem: true },
    });

    if (!order) throw new NotFoundException(`Order with id: ${id} not found`);

    if (userType === UserType.ADMIN) {
      await this.cancelOrder(id);
      return true;
    }

    if (order.status === OrderStatus.PENDING) {
      if (userType === UserType.SELLER) {
        const productsIds = order.orderItem.map((item) => item.productId);
        const product = await this.prisma.product.findFirst({
          where: { id: { in: productsIds } },
        });

        if (!product) {
          throw new ForbiddenError('Forbidden resource');
        }

        await this.cancelOrder(id);
        return true;
      } else if (userType === UserType.USER) {
        if (order.userId !== userId)
          throw new ForbiddenError('Forbidden resource');

        await this.cancelOrder(id);
        return true;
      }
    } else {
      throw new BadRequestException(
        'The order has passed the waiting stage. You cannot cancel the order',
      );
    }
  }

  private async cancelOrder(id: number): Promise<void> {
    await this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELED },
    });
  }

  async removeOrderById(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException(`order with id ${id} not found`);
    if (order.status !== OrderStatus.CANCELED)
      throw new BadRequestException(
        `must cancel the order before you can delete it`,
      );
    await this.prisma.order.delete({ where: { id } });
    return true;
  }

  async getOrderItemByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.prisma.orderItem.findMany({
      where: { orderId },
      include: { product: true, productItem: true },
    });
  }
}
