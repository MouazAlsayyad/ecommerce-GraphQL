import { Injectable } from '@nestjs/common';
import { LogInInput, SignInInput } from './dto/create-auth.input';
import { PrismaAuthRepository } from './auth-repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: PrismaAuthRepository) {}

  singIn(data: SignInInput) {
    return this.authRepository.singIn(data);
  }

  logIn(data: LogInInput) {
    return this.authRepository.login(data);
  }
}
