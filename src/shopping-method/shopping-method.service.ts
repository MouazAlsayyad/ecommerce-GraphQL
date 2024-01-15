import { Injectable } from '@nestjs/common';
import { CreateShoppingMethodInput } from './dto/create-shopping-method.input';
import { UpdateShoppingMethodInput } from './dto/update-shopping-method.input';
import { ShoppingMethod } from './entities/shopping-method.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShoppingMethodService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateShoppingMethodInput): Promise<ShoppingMethod> {
    return this.prisma.shoppingMethod.create({ data });
  }

  findAll(): Promise<ShoppingMethod[]> {
    return this.prisma.shoppingMethod.findMany();
  }

  findOne(id: number): Promise<ShoppingMethod> {
    return this.prisma.shoppingMethod.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateShoppingMethodInput): Promise<ShoppingMethod> {
    return this.prisma.shoppingMethod.update({ where: { id }, data });
  }

  async remove(id: number): Promise<boolean> {
    await this.prisma.shoppingMethod.delete({ where: { id } });
    return true;
  }
}
