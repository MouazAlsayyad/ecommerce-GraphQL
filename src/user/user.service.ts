import { Injectable } from '@nestjs/common';
import {
  AddressInput,
  CountryInput,
  CreateUserInput,
} from './dto/create-user.input';
import { PrismaUserRepository } from 'src/prisma/repositories';
import {
  AddAddressUseCase,
  AddCountryUseCase,
  BlockUserUseCase,
  CreateUserUseCase,
  DeleteAddressUseCase,
  DeleteUserUseCase,
  GetUserUseCase,
  GetUsersUseCase,
  UpdateAddressUseCase,
} from './usecase';
import {
  RemoveAddressInput,
  UpdateAddressInput,
} from './dto/update-user.input';

// import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(private userRepository: PrismaUserRepository) {}

  create(data: CreateUserInput) {
    const createUserUseCase = new CreateUserUseCase(this.userRepository);
    return createUserUseCase.execute(data);
  }

  findAll() {
    const getUsersUseCase = new GetUsersUseCase(this.userRepository);
    return getUsersUseCase.execute();
  }

  findOne(id: number) {
    const getUserUseCase = new GetUserUseCase(this.userRepository);
    return getUserUseCase.execute(id);
  }

  blockUser(id: number) {
    const blockUserUseCase = new BlockUserUseCase(this.userRepository);
    return blockUserUseCase.execute(id);
  }

  remove(id: number) {
    const deleteUserUseCase = new DeleteUserUseCase(this.userRepository);
    return deleteUserUseCase.execute(id);
  }

  addCountry(data: CountryInput) {
    const addCountryUseCase = new AddCountryUseCase(this.userRepository);
    return addCountryUseCase.execute(data);
  }

  addAddress(data: AddressInput, userId: number) {
    const addAddressUseCase = new AddAddressUseCase(this.userRepository);
    return addAddressUseCase.execute({ ...data, userId });
  }

  updateAddress(data: UpdateAddressInput, userId: number) {
    const updateAddressUseCase = new UpdateAddressUseCase(this.userRepository);
    return updateAddressUseCase.execute({ ...data, userId });
  }

  deleteAddress(data: RemoveAddressInput, userId: number) {
    const deleteAddressUseCase = new DeleteAddressUseCase(this.userRepository);
    return deleteAddressUseCase.execute({ ...data, userId });
  }
}
