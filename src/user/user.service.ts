import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  AddressDTO,
  CountryDTO,
  CreateUserInput,
} from './dto/create-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkExistingUserFields } from './user-service-utils';
import * as bcryptjs from 'bcryptjs';
import { CustomNotFoundException } from 'src/unit/not-found.exception';
import { ContextType } from 'src/unit/context-type';
import { UpdateAddressDTO } from './dto/update-user.input';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserInput: CreateUserInput) {
    return this.prisma.$transaction(async (tx) => {
      await checkExistingUserFields(
        createUserInput.email,
        createUserInput.username,
        createUserInput.phone_number,
        tx,
      );

      return tx.user.create({
        data: {
          email: createUserInput.email,
          username: createUserInput.username,
          phone_number: createUserInput.phone_number,
          password: await bcryptjs.hash(createUserInput.password, 12),
          user_type: createUserInput.user_type,
          isBlock: false,
        },
      });
    });
  }

  findAll() {
    return this.prisma.user.findMany({ where: { isBlock: false } });
  }

  findOne(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id },
      });

      if (!user)
        throw new CustomNotFoundException(`User with ID ${id} not found`);

      return user;
    });
  }

  blockUser(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const user = await this.findOne(id);

      return tx.user.update({
        where: { id },
        data: {
          isBlock: !user.isBlock,
        },
      });
    });
  }

  remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      await this.findOne(id);
      return tx.user.delete({
        where: { id },
      });
    });
  }

  addItemToFavoritesList(itemId: number, context: ContextType) {
    return this.prisma.$transaction(async (tx) => {
      const userId = context.req.user.id;
      const itemExist = await tx.favoritesList.findUnique({
        where: {
          userId_itemId: {
            itemId,
            userId,
          },
        },
      });

      if (itemExist)
        throw new BadRequestException(
          `The item with Id ${itemId} is already in your favorites list`,
        );

      return tx.favoritesList.create({
        data: {
          itemId,
          userId,
        },
      });
    });
  }

  removeItemFromFavoritesList(itemId: number, context: ContextType) {
    return this.prisma.$transaction(async (tx) => {
      const userId = context.req.user.id;
      const itemExist = await tx.favoritesList.findUnique({
        where: {
          userId_itemId: {
            itemId,
            userId,
          },
        },
      });

      if (!itemExist)
        throw new CustomNotFoundException(`Item with ID ${itemId} not found`);

      return tx.favoritesList.delete({
        where: {
          userId_itemId: {
            itemId,
            userId,
          },
        },
      });
    });
  }

  getFavoritesList(context: ContextType) {
    return this.prisma.$transaction(async (tx) => {
      const userId = context.req.user.id;

      return tx.favoritesList.findMany({
        where: {
          userId,
        },
      });
    });
  }

  addAddress(context: ContextType, addressDTO: AddressDTO) {
    const userId = context.req.user.id;
    return this.prisma.$transaction(async (tx) => {
      const country = await tx.country.findUnique({
        where: { id: addressDTO.countryId },
      });
      if (!country)
        throw new CustomNotFoundException(
          `country with ID ${addressDTO.countryId} not found`,
        );
      return tx.address.create({
        data: {
          userId,
          address: addressDTO.address,
          city: addressDTO.city,
          postal_code: addressDTO.postal_code,
          region: addressDTO.region,
          street_number: addressDTO.street_number,
          countryId: addressDTO.countryId,
        },
      });
    });
  }

  updateAddress(context: ContextType, addressDTO: UpdateAddressDTO) {
    const userId = context.req.user.id;
    return this.prisma.$transaction(async (tx) => {
      if (addressDTO.countryId) {
        const country = await tx.country.findUnique({
          where: { id: addressDTO.countryId },
        });
        if (!country)
          throw new CustomNotFoundException(
            `country with ID ${addressDTO.countryId} not found`,
          );
      }

      const address = await tx.address.findUnique({
        where: { id: addressDTO.id },
      });
      if (!address)
        throw new CustomNotFoundException(
          `address with ID ${addressDTO.id} not found`,
        );

      if (address.userId !== userId)
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      return tx.address.update({
        where: { id: addressDTO.id },
        data: {
          address: addressDTO.address,
          city: addressDTO.city,
          postal_code: addressDTO.postal_code,
          region: addressDTO.region,
          street_number: addressDTO.street_number,
          countryId: addressDTO.countryId,
        },
      });
    });
  }

  removeAddress(context: ContextType, id: number) {
    const userId = context.req.user.id;
    return this.prisma.$transaction(async (tx) => {
      const address = await tx.address.findUnique({
        where: { id },
      });
      if (!address)
        throw new CustomNotFoundException(`address with ID ${id} not found`);

      if (address.userId !== userId)
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      return tx.address.delete({
        where: { id },
      });
    });
  }

  addCountry(countryDTO: CountryDTO) {
    return this.prisma.$transaction(async (tx) => {
      const country = await tx.country.findFirst({
        where: { country_name: countryDTO.country_name },
      });
      if (country)
        throw new BadRequestException(
          `country with name ${countryDTO.country_name} is already exists`,
        );

      return tx.country.create({
        data: { country_name: countryDTO.country_name },
      });
    });
  }
}
