import { UserEntity } from '../entities/user-entity.interface';
import {
  AddressEntity,
  CountryEntity,
} from '../entities/address-entity.interface';
import { CreateUserDTO } from '../dtos/user-dto.interface';
import {
  CreateAddressDTO,
  CreateCountryDTO,
  UpdateAddressDTO,
} from '../dtos/address-dto.interface';

export interface UserRepository {
  create(data: CreateUserDTO): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findOne(id: number): Promise<UserEntity>;
  addCountry(data: CreateCountryDTO): Promise<CountryEntity>;
  addAddress(data: CreateAddressDTO): Promise<AddressEntity>;
  updateAddress(data: UpdateAddressDTO): Promise<AddressEntity>;
  removeAddress(userId: number, addressId: number): Promise<void>;
  blockUser(id: number): Promise<void>;
  remove(id: number): Promise<void>;
}
