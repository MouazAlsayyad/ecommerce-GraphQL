import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressInput, CreateUserInput } from './dto/create-user.input';
// import { User } from './entities/user.entity';
import {
  checkAddress,
  checkExistingUserFields,
} from './utils/user-service-utils';

import * as bcryptjs from 'bcryptjs';
// import { Address } from './entities/address.entity';
import { UpdateAddressInput } from './dto/update-user.input';

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateUserInput) {
    return this.prisma.$transaction(async (tx) => {
      const { email, username, phone_number } = data;
      await checkExistingUserFields(email, username, phone_number, tx);
      data.password = await bcryptjs.hash(data.password, 12);

      const { id } = await tx.user.create({ data });
      return this.findOne(id);
    });
  }

  findAll() {
    return this.prisma.user.findMany({ include: { addresses: true } });
  }

  findOne(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id },
        include: { addresses: true },
      });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      return user;
    });
  }

  addAddress(userId: number, data: CreateAddressInput): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const { address, cityId, postalCode, streetNumber, countryId, stateId } =
        data;
      await tx.address.create({
        data: {
          userId,
          address,
          cityId,
          postalCode,
          stateId,
          streetNumber,
          countryId,
        },
      });
      return true;
    });
  }

  updateAddress(userId: number, data: UpdateAddressInput) {
    return this.prisma.$transaction(async (tx) => {
      await checkAddress(data.id, userId, tx);

      return tx.address.update({
        where: { id: data.id },
        data: {
          address: data.address,
          // city: data.city,
          cityId: 3,
          postalCode: data.postal_code,
          // region: data.region,

          streetNumber: data.street_number,
          countryId: data.countryId,
        },
      });
    });
  }
  async removeAddress(userId: number, addressId: number): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      await checkAddress(addressId, userId, tx);

      await tx.address.delete({
        where: { id: addressId },
      });

      return true;
    });
  }

  async blockUser(id: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const user = await this.findOne(id);

      await tx.user.update({
        where: { id },
        data: { isBlock: !user.isBlock },
      });
    });
  }
  async remove(id: number): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      await tx.user.delete({ where: { id } });
      return true;
    });
  }
}
