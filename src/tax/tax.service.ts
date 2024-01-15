import { Injectable } from '@nestjs/common';
import { CreateTaxInput } from './dto/create-tax.input';
import { UpdateTaxInput } from './dto/update-tax.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaxService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateTaxInput) {
    // return this.prisma.tax.create({ data });
  }

  findAll() {
    return this.prisma.tax.findMany({ where: { active: true } });
  }

  findOne(id: number) {
    return this.prisma.tax.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateTaxInput) {
    return this.prisma.tax.update({ where: { id }, data });
  }

  async remove(id: number) {
    // await this.prisma.orderTax.deleteMany({ where: { taxId: id } });
    // await this.prisma.tax.delete({ where: { id } });
    return true;
  }
}
