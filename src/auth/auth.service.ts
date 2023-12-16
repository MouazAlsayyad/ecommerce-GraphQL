import { Injectable } from '@nestjs/common';
import { PrismaAuthRepository } from 'src/prisma/repositories';
import { LogInInput, SignInInput } from './dto/create-auth.input';
import { LogInUseCase, SingInUseCase } from './usecase';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: PrismaAuthRepository) {}

  singIn(data: SignInInput) {
    const singInUseCase = new SingInUseCase(this.authRepository);
    return singInUseCase.execute(data);
  }

  logIn(data: LogInInput) {
    const logInUseCase = new LogInUseCase(this.authRepository);
    return logInUseCase.execute(data);
  }
}
