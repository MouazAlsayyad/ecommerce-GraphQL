import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from './prisma/prisma.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import 'dotenv/config';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { CartModule } from './cart/cart.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ProductModule,
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    AuthModule,
    JwtModule.register({
      secret: process.env.JSON_TOKEN_KEY,
      signOptions: { expiresIn: process.env.JSON_TOKEN_EXPIRERS_IN },
    }),
    UserModule,
    CartModule,
    ReviewModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
