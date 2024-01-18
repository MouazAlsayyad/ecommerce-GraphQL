import { Injectable } from '@nestjs/common';
import { CreateAddressInput, CreateUserInput } from './dto/create-user.input';

import {
  RemoveAddressInput,
  UpdateAddressInput,
} from './dto/update-user.input';
import { PrismaUserRepository } from './user-repository';
import { UserFilterDTO } from './dto/filter-user.input';
import { UserIdsDTO } from './dto/block-users.input';
import { UpdateUsersTypeDTO } from './dto/edit-type-users.input';

@Injectable()
export class UserService {
  constructor(private userRepository: PrismaUserRepository) {}

  createUser(data: CreateUserInput): Promise<boolean> {
    return this.userRepository.create(data);
  }

  getAllUser(userFilterDTO: UserFilterDTO) {
    return this.userRepository.findAll(userFilterDTO);
  }

  findAddressesByUserId(userId: number) {
    return this.userRepository.findAddressesByUserId(userId);
  }

  findUserById(id: number) {
    return this.userRepository.findOne(id);
  }

  blockUser(id: number) {
    return this.userRepository.blockUser(id);
  }

  async blockUsersByIds(userBlockDTO: UserIdsDTO): Promise<boolean> {
    return this.userRepository.blockUsersByIds(userBlockDTO);
  }

  async unblockUsersByIds(userBlockDTO: UserIdsDTO): Promise<boolean> {
    return this.userRepository.unblockUsersByIds(userBlockDTO);
  }

  editUserType(updateUsersTypeDTO: UpdateUsersTypeDTO): Promise<boolean> {
    return this.userRepository.editUserType(updateUsersTypeDTO);
  }

  remove(id: number) {
    return this.userRepository.remove(id);
  }

  getAddressById(id: number) {
    return this.userRepository.getAddressById(id);
  }

  async addAddress(data: CreateAddressInput, userId: number) {
    await this.userRepository.addAddress(userId, data);
    return this.findUserById(userId);
  }

  async updateAddress(data: UpdateAddressInput, userId: number) {
    await this.userRepository.updateAddress(userId, data);
    return this.findUserById(userId);
  }

  deleteAddress(data: RemoveAddressInput, userId: number) {
    return this.userRepository.removeAddress(userId, data.addressId);
  }
}
