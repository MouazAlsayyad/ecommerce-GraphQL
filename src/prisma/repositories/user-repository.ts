import { Injectable, NotFoundException } from '@nestjs/common';

import {
  checkAddress,
  checkCountryById,
  checkCountryByName,
  checkExistingUserFields,
} from '../utils/user-service-utils';
import * as bcryptjs from 'bcryptjs';
import {
  AddressEntity,
  CountryEntity,
  CreateAddressDTO,
  CreateCountryDTO,
  CreateUserDTO,
  UpdateAddressDTO,
  UserEntity,
  UserRepository,
} from 'lib/types/src';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateUserDTO): Promise<UserEntity> {
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

  findAll(): Promise<UserEntity[]> {
    return this.prisma.user.findMany({ include: { addresses: true } });
  }

  findOne(id: number): Promise<UserEntity> {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id },
        include: { addresses: true },
      });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      return user;
    });
  }

  addCountry(data: CreateCountryDTO): Promise<CountryEntity> {
    return this.prisma.$transaction(async (tx) => {
      await checkCountryByName(data.country_name, tx);
      return tx.country.create({ data: { country_name: data.country_name } });
    });
  }

  addAddress(data: CreateAddressDTO): Promise<AddressEntity> {
    return this.prisma.$transaction(async (tx) => {
      await checkCountryById(data.countryId, tx);
      const {
        address,
        city,
        postal_code,
        region,
        street_number,
        countryId,
        userId,
      } = data;
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

  updateAddress(data: UpdateAddressDTO): Promise<AddressEntity> {
    return this.prisma.$transaction(async (tx) => {
      await checkCountryById(data.countryId, tx);
      await checkAddress(data.id, data.userId, tx);

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
