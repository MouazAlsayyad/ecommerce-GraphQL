import { AuthRepository, UseCase } from 'lib/types/src';
import { LogInInput } from '../dto/create-auth.input';
import { AuthResponse } from '../entities/auth.entity';

export class LogInUseCase
  implements UseCase<LogInInput, Promise<AuthResponse>>
{
  constructor(private authRepository: AuthRepository) {}

  async execute(data: LogInInput): Promise<AuthResponse> {
    return await this.authRepository.login(data);
  }
}
