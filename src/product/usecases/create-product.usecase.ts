import { ProductRepository, UseCase } from 'lib/types/src';
import { CreateProductInput } from '../dto/create-product.input';
import { Product } from '../entities/product.entity';

export class CreateProductUseCase
  implements UseCase<CreateProductInput, Promise<Product>>
{
  constructor(private productRepository: ProductRepository) {}

  execute(input: CreateProductInput): Promise<Product> {
    return this.productRepository.insertProduct(input);
  }
}
