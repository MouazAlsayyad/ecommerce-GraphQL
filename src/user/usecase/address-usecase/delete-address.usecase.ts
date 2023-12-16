import { UseCase, UserRepository } from 'lib/types/src';
import { RemoveAddressInput } from '../../dto/update-user.input';
import { User } from 'src/user/entities/user.entity';

export class DeleteAddressUseCase
  implements UseCase<RemoveAddressInput, Promise<User>>
{
  constructor(private userRepository: UserRepository) {}

  async execute(data: RemoveAddressInput & { userId: number }): Promise<User> {
    await this.userRepository.removeAddress(data.addressId, data.userId);
    return await this.userRepository.findOne(data.userId);
  }
}
