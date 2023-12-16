import {
  AttributeRepository,
  ProductEntity,
  ProductRepository,
  UseCase,
} from 'lib/types/src';
import { UpdateProductAttributeInput } from '../../dto/update-product.input';

export class UpdateAttributeUseCase
  implements UseCase<UpdateProductAttributeInput, Promise<ProductEntity>>
{
  constructor(
    private attributeRepository: AttributeRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(data: UpdateProductAttributeInput): Promise<ProductEntity> {
    await this.attributeRepository.updateAttribute(data);
    return await this.productRepository.getProductById(data.productId);
  }
}
