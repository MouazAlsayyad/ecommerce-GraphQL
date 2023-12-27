import { Module } from '@nestjs/common';
import { FavoritesListService } from './favorites-list.service';
import { FavoritesListResolver } from './favorites-list.resolver';
import { PrismaFavoritesListRepository } from './favorites-list-repository';
import { ProductService } from 'src/product/product.service';
import { PrismaProductRepository } from 'src/product/repositories/product-repository';
import { PrismaAttributeRepository } from 'src/product/repositories/attribute-repository';
import { PrismaVariationRepository } from 'src/product/repositories/variation-repository';
import { PrismaProductItemRepository } from 'src/product/repositories/item-repository';

@Module({
  providers: [
    PrismaFavoritesListRepository,
    FavoritesListResolver,
    FavoritesListService,
    ProductService,
    PrismaProductRepository,
    PrismaAttributeRepository,
    PrismaVariationRepository,
    PrismaProductItemRepository,
  ],
})
export class FavoritesListModule {}
