import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PrismaUserRepository } from './user-repository';
import { CountryService } from 'src/country/country.service';

@Module({
  providers: [
    CountryService,
    UserResolver,
    UserService,
    PrismaUserRepository,
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
