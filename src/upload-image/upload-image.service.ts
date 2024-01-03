import { BadRequestException, Injectable } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import * as Upload from 'graphql-upload/Upload.js';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UploadImageService {
  constructor(private prisma: PrismaService) {}
  async uploadImage(image: Upload) {
    const file = await image;

    const dirPath = join(
      __dirname.split('\\').slice(0, -2).join('\\'),
      '/uploads',
    );
    const filename = this.filename(file);
    const path = `${dirPath}\\${filename}`;

    // Check if the uploaded file is an image
    const isImage = this.isImage(file.mimetype);

    if (!isImage)
      throw new BadRequestException(
        'Invalid file type. Please upload an image.',
      );

    return await this.prisma.$transaction(async (tx) => {
      await new Promise((resolve, reject) => {
        if (!existsSync(dirPath)) {
          mkdirSync(dirPath, { recursive: true });
        }

        file
          .createReadStream()
          .pipe(createWriteStream(`${dirPath}/${filename}`))
          .on('finish', async () => {
            resolve(true);
          })
          .on('error', () => {
            reject(false);
          });
      });

      return tx.image.create({ data: { filename, path } });
    });
  }

  private filename(file: Upload) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const name = file.filename.split('.')[0];
    const extension = file.filename.split('.').pop();
    return `${name}-${uniqueSuffix}.${extension}`;
  }

  private isImage(mimeType: string): boolean {
    // Define a list of valid image MIME types
    const validImageTypes = [
      'image/jpeg',
      'image/png',
      // 'image/gif',
      // 'image/webp',
    ];
    // Check if the provided MIME type is in the list
    return validImageTypes.includes(mimeType);
  }
}
