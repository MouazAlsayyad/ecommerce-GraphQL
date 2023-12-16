import { NotFoundException } from '@nestjs/common';
import { ProductEntity, ProductRepository, UseCase } from 'lib/types/src';
import { UpdateProductInput } from '../dto/update-product.input';

export class UpdateProductUseCase
  implements UseCase<UpdateProductInput, Promise<ProductEntity>>
{
  constructor(private productRepository: ProductRepository) {}

  async execute(input: UpdateProductInput): Promise<ProductEntity> {
    const product = await this.productRepository.getProductById(input.id);
    if (!product)
      throw new NotFoundException(`Product with ID ${input.id} not found`);

    const updatedTodo = await this.productRepository.updateProductById(input);
    return updatedTodo;
  }
}
