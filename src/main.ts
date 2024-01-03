import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { config as dotenv } from 'dotenv';
import * as bodyParser from 'body-parser';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SkipValidationPipe } from './pipes/skip-validation.pipe';
dotenv();

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app: INestApplication = await NestFactory.create(
    AppModule,
    new ExpressAdapter(),
  );
  // Use bodyParser middleware to parse JSON with a higher limit
  app.use(bodyParser.json({ limit: '10mb' }));

  // Use graphqlUploadExpress for handling file uploads
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }),
  );

  app.useGlobalPipes(new SkipValidationPipe());

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //   }),
  // );
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
