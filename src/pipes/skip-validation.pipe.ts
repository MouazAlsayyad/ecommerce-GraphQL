import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SkipValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const skipValidation = Reflect.getMetadata(
      'skipValidation',
      metadata.metatype,
    );
    if (skipValidation) {
      return value;
    }
    return value;
  }
  whitelist: true;
  transformOptions: {
    enableImplicitConversion: true;
  };
}
