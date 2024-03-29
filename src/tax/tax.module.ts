import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxResolver } from './tax.resolver';

@Module({
  providers: [TaxResolver, TaxService],
  exports: [TaxService],
})
export class TaxModule {}
