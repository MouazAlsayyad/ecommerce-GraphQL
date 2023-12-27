import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PrismaAttributeRepository } from './repositories/attribute-repository';
import { PrismaProductItemRepository } from './repositories/item-repository';
import { PrismaProductRepository } from './repositories/product-repository';
import { PrismaVariationRepository } from './repositories/variation-repository';
import { ReviewService } from 'src/review/review.service';
import { PrismaReviewRepository } from 'src/review/review-repository';

@Module({
  providers: [
    ProductResolver,
    ProductService,
    JwtService,
    PrismaAttributeRepository,
    PrismaProductItemRepository,
    PrismaProductRepository,
    PrismaVariationRepository,
    PrismaReviewRepository,
    ReviewService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
