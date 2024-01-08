import { Module } from '@nestjs/common';
import { FilterService } from './filter.service';
import { FilterResolver } from './filter.resolver';

@Module({
  providers: [FilterResolver, FilterService],
})
export class FilterModule {}
