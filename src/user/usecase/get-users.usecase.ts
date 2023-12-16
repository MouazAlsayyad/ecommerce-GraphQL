import { UseCase, UserEntity, UserRepository } from 'lib/types/src';

export class GetUsersUseCase implements UseCase<void, Promise<UserEntity[]>> {
  constructor(private userRepository: UserRepository) {}

  execute(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }
}
