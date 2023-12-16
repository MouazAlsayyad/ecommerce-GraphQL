import { UseCase, UserRepository } from 'lib/types/src';
import { AddressInput } from '../../dto/create-user.input';
import { User } from 'src/user/entities/user.entity';

export class AddAddressUseCase implements UseCase<AddressInput, Promise<User>> {
  constructor(private userRepository: UserRepository) {}

  async execute(data: AddressInput & { userId: number }): Promise<User> {
    await this.userRepository.addAddress(data);
    return await this.userRepository.findOne(data.userId);
  }
}
