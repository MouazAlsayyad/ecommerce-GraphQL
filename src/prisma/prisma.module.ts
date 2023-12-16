import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  PrismaAttributeRepository,
  PrismaProductItemRepository,
  PrismaProductRepository,
  PrismaVariationRepository,
  PrismaUserRepository,
  PrismaAuthRepository,
  PrismaBrandRepository,
  PrismaCartRepository,
  PrismaCategoryRepository,
  PrismaReviewRepository,
  PrismaFavoritesListRepository,
} from './repositories';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  providers: [
    PrismaService,
    PrismaAttributeRepository,
    PrismaProductItemRepository,
    PrismaProductRepository,
    PrismaVariationRepository,
    PrismaUserRepository,
    PrismaAuthRepository,
    PrismaBrandRepository,
    PrismaCartRepository,
    PrismaCategoryRepository,
    PrismaReviewRepository,
    PrismaFavoritesListRepository,
    JwtService,
  ],
  exports: [
    PrismaService,
    PrismaAttributeRepository,
    PrismaProductItemRepository,
    PrismaProductRepository,
    PrismaVariationRepository,
    PrismaUserRepository,
    PrismaAuthRepository,
    PrismaBrandRepository,
    PrismaCartRepository,
    PrismaCategoryRepository,
    PrismaReviewRepository,
    PrismaFavoritesListRepository,
  ],
})
export class PrismaModule {}
