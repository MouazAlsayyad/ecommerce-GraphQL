import { Module } from '@nestjs/common';
import { FavoritesListService } from './favorites-list.service';
import { FavoritesListResolver } from './favorites-list.resolver';

@Module({
  providers: [FavoritesListResolver, FavoritesListService],
})
export class FavoritesListModule {}
