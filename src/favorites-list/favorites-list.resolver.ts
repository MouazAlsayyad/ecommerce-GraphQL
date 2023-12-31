import {
  Resolver,
  Mutation,
  Args,
  Query,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { FavoritesListService } from './favorites-list.service';
import { FavoritesList } from './entities/favorites-list.entity';
import { FavoritesListInput } from './dto/create-favorites-list.input';
import { UserType } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ContextType } from 'src/unit/context-type';
import { Logger } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';

@Resolver(() => FavoritesList)
export class FavoritesListResolver {
  constructor(
    private readonly favoritesListService: FavoritesListService,
    private readonly productService: ProductService,
  ) {}
  private readonly logger = new Logger(FavoritesListResolver.name);
  @Roles(UserType.USER, UserType.ADMIN)
  @Mutation(() => [FavoritesList])
  addProductToFavoritesList(
    @Args('favoritesListInput')
    favoritesListInput: FavoritesListInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.favoritesListService.addProductToFavoritesList(
        favoritesListInput,
        context.req.user.id,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Mutation(() => [FavoritesList])
  removeProductFromFavoritesList(
    @Args('favoritesListInput')
    favoritesListInput: FavoritesListInput,
    @Context() context: ContextType,
  ) {
    try {
      return this.favoritesListService.removeProductFromFavoritesList(
        favoritesListInput,
        context.req.user.id,
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Query(() => [FavoritesList], { name: 'FavoritesList' })
  getFavoritesList(@Context() context: ContextType) {
    try {
      return this.favoritesListService.getFavoritesList(context.req.user.id);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @ResolveField(() => Product)
  product(@Parent() FavoritesList: FavoritesList) {
    const { productId } = FavoritesList;
    return this.productService.findOne(productId);
  }
}
