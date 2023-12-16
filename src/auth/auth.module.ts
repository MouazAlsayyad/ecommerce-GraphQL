import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthResolver, AuthService, JwtService],
})
export class AuthModule {}
