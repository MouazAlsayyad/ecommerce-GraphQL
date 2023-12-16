import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BrandResolver } from './brand.resolver';
import { BrandService } from './brand.service';

@Module({
  providers: [
    BrandResolver,
    BrandService,
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
export class BrandModule {}
