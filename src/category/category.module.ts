import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { PrismaCategoryRepository } from './category-repository';
import { ProductService } from 'src/product/product.service';
import { PrismaProductRepository } from 'src/product/repositories/product-repository';
import { PrismaAttributeRepository } from 'src/product/repositories/attribute-repository';
import { PrismaVariationRepository } from 'src/product/repositories/variation-repository';
import { PrismaProductItemRepository } from 'src/product/repositories/item-repository';
import { PrismaReviewRepository } from 'src/review/review-repository';
import { ReviewService } from 'src/review/review.service';
import { PrismaItemImageRepository } from 'src/product/repositories/item-image-repository';
import { PrismaProductImageRepository } from 'src/product/repositories/product-image-repository';

@Module({
  providers: [
    CategoryResolver,
    CategoryService,
    JwtService,
    PrismaCategoryRepository,
    ProductService,
    PrismaProductRepository,
    PrismaAttributeRepository,
    PrismaVariationRepository,
    PrismaProductItemRepository,
    PrismaReviewRepository,
    PrismaItemImageRepository,
    PrismaProductImageRepository,
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
  exports: [CategoryService],
})
export class CategoryModule {}
