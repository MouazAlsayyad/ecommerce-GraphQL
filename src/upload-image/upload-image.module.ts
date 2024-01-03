import { Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageResolver } from './upload-image.resolver';

@Module({
  providers: [UploadImageResolver, UploadImageService],
})
export class UploadImageModule {}
