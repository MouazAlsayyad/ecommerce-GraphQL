import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PrismaAuthRepository } from './auth-repository';

@Module({
  providers: [JwtService, AuthResolver, AuthService, PrismaAuthRepository],
})
export class AuthModule {}
