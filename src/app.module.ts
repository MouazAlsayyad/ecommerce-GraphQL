import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CartModule } from './cart/cart.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { ReviewModule } from './review/review.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { FavoritesListModule } from './favorites-list/favorites-list.module';
import { UploadImageModule } from './upload-image/upload-image.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    PrismaModule,
    ProductModule,
    UserModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JSON_TOKEN_KEY,
      signOptions: { expiresIn: process.env.JSON_TOKEN_EXPIRERS_IN },
    }),
    CartModule,
    ReviewModule,
    CategoryModule,
    BrandModule,
    FavoritesListModule,
    UploadImageModule,
    TagModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
