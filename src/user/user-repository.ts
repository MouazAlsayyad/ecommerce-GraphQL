import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
// 
import { Prisma } from '@prisma/client';
import { UserFilterDTO, UserOrderBy } from './dto/filter-user.input';
import { UpdateUsersTypeDTO } from './dto/edit-type-users.input';
import { UserIdsDTO } from './dto/block-users.input';


@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateUserInput) {
    return this.prisma.$transaction(async (tx) => {
      const { email, username, phone_number } = data;
      await checkExistingUserFields(email, username, phone_number, tx);
      data.password = await bcryptjs.hash(data.password, 12);

      await tx.user.create({ data });
      return true;
    });
  }

  findAll(userFilterDTO: UserFilterDTO) {
    const orderBy: Prisma.UserOrderByWithRelationInput = {
      ...(userFilterDTO.orderBy === UserOrderBy.AToZByEmail && {
        email: 'asc',
      }),
      ...(userFilterDTO.orderBy === UserOrderBy.ZToAByEmail && {
        email: 'desc',
      }),
      ...(userFilterDTO.orderBy === UserOrderBy.AToZByName && {
        username: 'asc',
      }),
      ...(userFilterDTO.orderBy === UserOrderBy.ZToAByName && {
        username: 'desc',
      }),
      ...(userFilterDTO.orderBy === UserOrderBy.NewUser && {
        created_at: 'desc',
      }),
      ...(userFilterDTO.orderBy === UserOrderBy.OldUser && {
        created_at: 'asc',
      }),
    };

    const where: Prisma.UserWhereInput = {
      ...(userFilterDTO?.filter?.email && {
        email: { contains: userFilterDTO.filter.email },
      }),
      ...(userFilterDTO?.filter?.username && {
        username: { contains: userFilterDTO.filter.username },
      }),
      ...(userFilterDTO?.filter?.isBlock && {
        isBlock: userFilterDTO.filter.isBlock,
      }),
      ...(userFilterDTO?.filter?.phone_number && {
        phone_number: userFilterDTO.filter.phone_number,
      }),
      ...(userFilterDTO?.filter?.userType && {
        user_type: userFilterDTO.filter.userType,
      }),
    };

    const userFindManyArgs: Prisma.UserFindManyArgs = {
      where,
      orderBy,
      skip: userFilterDTO?.skip ? 1 : 0,
      cursor: userFilterDTO?.skip ? { id: userFilterDTO.skip } : undefined,
      take: userFilterDTO?.take ? userFilterDTO?.take : 10,
    };
    return this.prisma.user.findMany(userFindManyArgs);
  }

  findAddressesByUserId(userId: number) {
    return this.prisma.address.findMany({ where: { userId } });
  }

  async editUserType(updateUsersTypeDTO: UpdateUsersTypeDTO) {
    await this.prisma.user.updateMany({
      where: { id: { in: updateUsersTypeDTO.usersIds } },
      data: { user_type: updateUsersTypeDTO.userType },
    });
    return true;
  }

  async blockUsersByIds(userBlockDTO: UserIdsDTO) {
    return this.prisma.$transaction(async (tx) => {
      const users = await tx.user.findMany({
        where: { id: { in: userBlockDTO.usersIds } },
        select: { id: true },
      });

      if (users.length === 0)
        throw new BadRequestException(`The ID's passed is invalid`);
      const usersIds = users.map((user) => {
        return user.id;
      });

      await tx.user.updateMany({
        where: { id: { in: usersIds } },
        data: { isBlock: true },
      });
      return true;
    });
  }

  async unblockUsersByIds(userBlockDTO: UserIdsDTO) {
    return this.prisma.$transaction(async (tx) => {
      const users = await tx.user.findMany({
        where: { id: { in: userBlockDTO.usersIds } },
        select: { id: true },
      });

      if (users.length === 0)
        throw new BadRequestException(`The ID's passed is invalid`);
      const usersIds = users.map((user) => {
        return user.id;
      });

      await tx.user.updateMany({
        where: { id: { in: usersIds } },
        data: { isBlock: false },
      });
      return true;
    });
  }

  findOne(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      return user;
    });
  }

  getAddressById(id: number) {
    return this.prisma.address.findUnique({ where: { id } });
  }

  addAddress(userId: number, data: CreateAddressInput): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      await tx.address.create({
        data: {
          userId,
          ...data,
        },
      });
      return true;
    });
  }

  updateAddress(userId: number, data: UpdateAddressInput) {
    return this.prisma.$transaction(async (tx) => {
      await checkAddress(data.id, userId, tx);
      const { id, ...updatedData } = data;
      return tx.address.update({ where: { id }, data: updatedData });
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
