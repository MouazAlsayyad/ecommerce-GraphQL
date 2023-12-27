import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { PrismaReviewRepository } from './review-repository';

@Module({
  providers: [
    ReviewResolver,
    ReviewService,
    PrismaReviewRepository,
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
  exports:[ReviewService]
})
export class ReviewModule {}
