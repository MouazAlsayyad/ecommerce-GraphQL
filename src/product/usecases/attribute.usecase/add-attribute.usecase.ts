import { AttributeRepository, ProductRepository, UseCase } from 'lib/types/src';
import { AddProductAttributeInput } from '../../dto/create-product.input';
import { Product } from 'src/product/entities/product.entity';

export class AddAttributeUseCase
  implements UseCase<AddProductAttributeInput, Promise<Product>>
{
  constructor(
    private attributeRepository: AttributeRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(data: AddProductAttributeInput): Promise<Product> {
    await this.attributeRepository.addAttribute(data);
    return await this.productRepository.getProductById(data.productId);
  }
}
