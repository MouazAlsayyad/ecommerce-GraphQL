import {
  ProductEntity,
  ProductRepository,
  UseCase,
  VariationRepository,
} from 'lib/types/src';
import { UpdateVariationInput } from '../../dto/update-product.input';

export class UpdateVariationUseCase
  implements UseCase<UpdateVariationInput, Promise<ProductEntity>>
{
  constructor(
    private variationRepository: VariationRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(data: UpdateVariationInput): Promise<ProductEntity> {
    await this.variationRepository.updateVariationNameById(data);
    return await this.productRepository.getProductById(data.productId);
  }
}
