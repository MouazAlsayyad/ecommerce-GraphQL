import { Injectable } from '@nestjs/common';
import {
  AddressInput,
  CountryInput,
  CreateUserInput,
} from './dto/create-user.input';

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

  addCountry(data: CountryInput) {
    return this.userRepository.addCountry(data);
  }

  addAddress(data: AddressInput, userId: number) {
    return this.userRepository.addAddress(userId, data);
  }

  updateAddress(data: UpdateAddressInput, userId: number) {
    return this.userRepository.updateAddress(userId, data);
  }

  deleteAddress(data: RemoveAddressInput, userId: number) {
    return this.userRepository.removeAddress(userId, data.addressId);
  }
}
