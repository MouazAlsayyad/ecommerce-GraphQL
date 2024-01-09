import { Resolver, Query, Args } from '@nestjs/graphql';
import { FilterService } from './filter.service';
import { Filter } from './entities/filter.entity';
import { FilterDTO } from 'src/product/dto/create-product.input';
import { Logger } from '@nestjs/common';

@Resolver(() => Filter)
export class FilterResolver {
  constructor(private readonly filterService: FilterService) {}
  private readonly logger = new Logger(FilterResolver.name);

  @Query(() => Filter, { name: 'filter' })
  findAll(
    @Args('filterDTO', { type: () => FilterDTO, nullable: true })
    filterDTO: FilterDTO,
  ) {
    try {
      return this.filterService.findAll(filterDTO);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
