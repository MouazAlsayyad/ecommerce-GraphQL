import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UploadImageService } from './upload-image.service';
import { SkipValidation } from './decorators/skip-validation.decorator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import { UploadImage } from './entities/image.entity';
import { Logger } from '@nestjs/common';

@Resolver()
export class UploadImageResolver {
  constructor(private readonly uploadImageService: UploadImageService) {}
  private readonly logger = new Logger(UploadImageResolver.name);
  @Mutation(() => UploadImage, { name: 'uploadImage' })
  @SkipValidation()
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
