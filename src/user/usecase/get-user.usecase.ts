import { UseCase, UserEntity, UserRepository } from 'lib/types/src';

export class GetUserUseCase implements UseCase<number, Promise<UserEntity>> {
  constructor(private userRepository: UserRepository) {}

  execute(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }
}
