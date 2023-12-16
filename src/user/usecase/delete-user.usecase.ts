import { UseCase, UserRepository } from 'lib/types/src';
import { User } from '../entities/user.entity';

export class DeleteUserUseCase implements UseCase<number, Promise<User>> {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: number): Promise<User> {
    const user = this.userRepository.findOne(userId);
    await this.userRepository.remove(userId);
    return user;
  }
}
