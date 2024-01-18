import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryResolver } from './country.resolver';

@Module({
  providers: [CountryResolver, CountryService],
  exports: [CountryService],
})
export class CountryModule {}
