import { AttributeRepository, ProductRepository, UseCase } from 'lib/types/src';
import { Product } from 'src/product/entities/product.entity';

export class DeleteAttributeUseCase
  implements UseCase<number, Promise<Product>>
{
  constructor(
    private attributeRepository: AttributeRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(attributeId: number): Promise<Product> {
    const id = await this.attributeRepository.removeAttribute(attributeId);
    return this.productRepository.getProductById(id);
  }
}
