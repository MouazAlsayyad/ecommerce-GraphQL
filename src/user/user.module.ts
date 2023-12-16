import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Module({
  providers: [
    UserResolver,
    UserService,
    JwtService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class UserModule {}
