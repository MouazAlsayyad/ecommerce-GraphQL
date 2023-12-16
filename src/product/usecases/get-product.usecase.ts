import { NotFoundException } from '@nestjs/common';
import { ProductEntity, ProductRepository, UseCase } from 'lib/types/src';

export class GetProductUseCase
  implements UseCase<number, Promise<ProductEntity>>
{
  constructor(private productRepository: ProductRepository) {}

  async execute(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.getProductById(id);
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);

    return product;
  }
}
