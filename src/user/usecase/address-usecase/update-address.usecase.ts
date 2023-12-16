import { UseCase, UserRepository } from 'lib/types/src';
import { UpdateAddressInput } from '../../dto/update-user.input';
import { User } from 'src/user/entities/user.entity';

export class UpdateAddressUseCase
  implements UseCase<UpdateAddressInput, Promise<User>>
{
  constructor(private userRepository: UserRepository) {}

  async execute(data: UpdateAddressInput & { userId: number }): Promise<User> {
    await this.userRepository.updateAddress(data);
    return await this.userRepository.findOne(data.userId);
  }
}
