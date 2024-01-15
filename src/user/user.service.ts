import { Injectable } from '@nestjs/common';
import { CreateAddressInput, CreateUserInput } from './dto/create-user.input';

import {
  RemoveAddressInput,
  UpdateAddressInput,
} from './dto/update-user.input';
import { PrismaUserRepository } from './user-repository';

@Injectable()
export class UserService {
  constructor(private userRepository: PrismaUserRepository) {}

  create(data: CreateUserInput) {
    return this.userRepository.create(data);
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  blockUser(id: number) {
    return this.userRepository.blockUser(id);
  }

  remove(id: number) {
    return this.userRepository.remove(id);
  }

  async addAddress(data: CreateAddressInput, userId: number) {
    await this.userRepository.addAddress(userId, data);
    return this.findOne(userId);
  }

  async updateAddress(data: UpdateAddressInput, userId: number) {
    await this.userRepository.updateAddress(userId, data);
    return this.findOne(userId);
  }

  deleteAddress(data: RemoveAddressInput, userId: number) {
    return this.userRepository.removeAddress(userId, data.addressId);
  }
}
