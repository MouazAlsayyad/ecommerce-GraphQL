import { ProductRepository, UseCase } from 'lib/types/src';
import { Product } from '../entities/product.entity';

export class DeleteProductUseCase implements UseCase<number, Promise<Product>> {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: number): Promise<Product> {
    const product = await this.productRepository.getProductById(id);
    await this.productRepository.deleteProductById(id);
    return product;
  }
}
