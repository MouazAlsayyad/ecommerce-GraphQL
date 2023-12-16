import { UseCase, UserRepository } from 'lib/types/src';
import { User } from '../entities/user.entity';

export class BlockUserUseCase implements UseCase<number, Promise<User>> {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: number): Promise<User> {
    await this.userRepository.blockUser(userId);
    return this.userRepository.findOne(userId);
  }
}
