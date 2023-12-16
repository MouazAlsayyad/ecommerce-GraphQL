import { AuthRepository, UseCase } from 'lib/types/src';
import { SignInInput } from '../dto/create-auth.input';
import { AuthResponse } from '../entities/auth.entity';

export class SingInUseCase
  implements UseCase<SignInInput, Promise<AuthResponse>>
{
  constructor(private authRepository: AuthRepository) {}

  async execute(data: SignInInput): Promise<AuthResponse> {
    return await this.authRepository.singIn(data);
  }
}
