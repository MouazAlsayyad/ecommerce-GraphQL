import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddressInput,
  CountryInput,
  CreateUserInput,
} from './dto/create-user.input';
import { User } from './entities/user.entity';
import {
  checkAddress,
  checkCountryById,
  checkCountryByName,
  checkExistingUserFields,
} from './utils/user-service-utils';

import * as bcryptjs from 'bcryptjs';
import { Address, Country } from './entities/address.entity';
import { UpdateAddressInput } from './dto/update-user.input';

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateUserInput): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      const { email, username, phone_number, password, user_type } = data;
      await checkExistingUserFields(email, username, phone_number, tx);

      const { id } = await tx.user.create({
        data: {
          email,
          username,
          phone_number,
          user_type,
          password: await bcryptjs.hash(password, 12),
          isBlock: false,
        },
      });
      return this.findOne(id);
    });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ include: { addresses: true } });
  }

  findOne(id: number): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id },
        include: { addresses: true },
      });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      return user;
    });
  }

  addCountry(data: CountryInput): Promise<Country> {
    return this.prisma.$transaction(async (tx) => {
      await checkCountryByName(data.country_name, tx);
      return tx.country.create({ data: { country_name: data.country_name } });
    });
  }

  addAddress(userId: number, data: AddressInput): Promise<Address> {
    return this.prisma.$transaction(async (tx) => {
      await checkCountryById(data.countryId, tx);
      const { address, city, postal_code, region, street_number, countryId } =
        data;
      return tx.address.create({
        data: {
          userId,
          address,
          city,
          postal_code,
          region,
          street_number,
          countryId,
        },
      });
    });
  }

  updateAddress(userId: number, data: UpdateAddressInput): Promise<Address> {
    return this.prisma.$transaction(async (tx) => {
      await checkCountryById(data.countryId, tx);
      await checkAddress(data.id, userId, tx);

      return tx.address.update({
        where: { id: data.id },
        data: {
          address: data.address,
          city: data.city,
          postal_code: data.postal_code,
          region: data.region,
          street_number: data.street_number,
          countryId: data.countryId,
        },
      });
    });
  }
  async removeAddress(userId: number, addressId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await checkAddress(addressId, userId, tx);

      return tx.address.delete({
        where: { id: addressId },
      });
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
  async remove(id: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      tx.user.delete({ where: { id } });
    });
  }
}
