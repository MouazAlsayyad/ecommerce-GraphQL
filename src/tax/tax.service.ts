import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaxInput } from './dto/create-tax.input';
import { UpdateTaxInput } from './dto/update-tax.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tax } from './entities/tax.entity';

@Injectable()
export class TaxService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateTaxInput): Promise<Tax> {
    return this.prisma.$transaction(async (tx) => {
      const { name, active, countryCode, stateCode, taxRate } = data;
      const country = await tx.country.findFirst({
        where: { countryCode: countryCode },
      });
      if (!country)
        throw new NotFoundException(
          `country with countryCode ${countryCode} not found`,
        );
      const state = await tx.state.findFirst({
        where: { AND: [{ stateCode: stateCode }, { countryId: country.id }] },
      });
      if (!state)
        throw new NotFoundException(
          `state with stateCode ${stateCode} not found`,
        );
      const existTax = await tx.tax.findFirst({
        where: { AND: [{ countryId: country.id }, { stateId: state.id }] },
      });
      if (existTax)
        throw new BadRequestException(
          `tax with stateCode ${stateCode} and countryCode ${countryCode} is already existing `,
        );
      const tax = await tx.tax.create({
        data: {
          name,
          taxRate,
          active,
          countryId: country.id,
          stateId: state.id,
        },
      });
      return { countryCode, stateCode, ...tax };
    });
  }

  findAll() {
    return this.prisma.tax.findMany({});
  }

  findOne(id: number) {
    return this.prisma.tax.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateTaxInput) {
    return this.prisma.tax.update({ where: { id }, data });
  }

  async remove(id: number) {
    console.log(id);
    // await this.prisma.orderTax.deleteMany({ where: { taxId: id } });
    // await this.prisma.tax.delete({ where: { id } });
    return true;
  }
}
