import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LogInInput, SignInInput } from './dto/create-auth.input';
import { AuthResponse } from './entities/auth.entity';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthResolver.name);
  @Mutation(() => AuthResponse)
  singIn(@Args('singInInput') singInInput: SignInInput) {
    try {
      return this.authService.singIn(singInInput);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Mutation(() => AuthResponse)
  login(@Args('loginInput') loginInput: LogInInput) {
    try {
      return this.authService.logIn(loginInput);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
