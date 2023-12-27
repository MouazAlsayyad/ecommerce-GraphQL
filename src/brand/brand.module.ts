import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BrandResolver } from './brand.resolver';
import { BrandService } from './brand.service';
import { PrismaBrandRepository } from './brand-repository';
import { ProductService } from 'src/product/product.service';
import { PrismaProductRepository } from 'src/product/repositories/product-repository';
import { PrismaAttributeRepository } from 'src/product/repositories/attribute-repository';
import { PrismaVariationRepository } from 'src/product/repositories/variation-repository';
import { PrismaProductItemRepository } from 'src/product/repositories/item-repository';
import { CategoryService } from 'src/category/category.service';
import { PrismaCategoryRepository } from 'src/category/category-repository';

@Module({
  providers: [
    BrandResolver,
    BrandService,
    ProductService,
    PrismaBrandRepository,
    PrismaProductRepository,
    PrismaAttributeRepository,
    PrismaVariationRepository,
    PrismaProductItemRepository,
    PrismaCategoryRepository,
    JwtService,
    CategoryService,
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
