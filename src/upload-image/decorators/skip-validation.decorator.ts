import { SetMetadata } from '@nestjs/common';

export const SkipValidation = () => SetMetadata('skipValidation', true);
