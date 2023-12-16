import {
  FilterDTO,
  ProductEntity,
  ProductRepository,
  UseCase,
} from 'lib/types/src';

export class GetProductsUseCase
  implements UseCase<FilterDTO, Promise<ProductEntity[]>>
{
  constructor(private productRepository: ProductRepository) {}

  execute(data: FilterDTO): Promise<ProductEntity[]> {
    return this.productRepository.getProducts(data);
  }
}
