import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UploadImageService } from './upload-image.service';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import type * as Upload from 'graphql-upload/Upload.js';
import { UploadImage } from './entities/image.entity';
import { Logger } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';

@Resolver()
export class UploadImageResolver {
  constructor(private readonly uploadImageService: UploadImageService) {}
  private readonly logger = new Logger(UploadImageResolver.name);
  
  @Roles(UserType.ADMIN, UserType.SELLER)
  @Mutation(() => UploadImage, { name: 'uploadImage' })
  async uploadImage(
    @Args({ name: 'image', type: () => GraphQLUpload })
    image: Upload,
  ) {
    try {
      return this.uploadImageService.uploadImage(image);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
