import { UseCase, UserRepository } from 'lib/types/src';
import { CreateUserInput } from '../dto/create-user.input';
import { User } from '../entities/user.entity';

export class CreateUserUseCase
  implements UseCase<CreateUserInput, Promise<User>>
{
  constructor(private userRepository: UserRepository) {}

  execute(data: CreateUserInput): Promise<User> {
    return this.userRepository.create(data);
  }
}
