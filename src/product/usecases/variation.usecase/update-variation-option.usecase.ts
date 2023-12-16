import {
  ProductEntity,
  ProductRepository,
  UseCase,
  VariationRepository,
} from 'lib/types/src';
import { UpdateVariationOptionInput } from '../../dto/update-product.input';

export class UpdateVariationOptionUseCase
  implements UseCase<UpdateVariationOptionInput, Promise<ProductEntity>>
{
  constructor(
    private variationRepository: VariationRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(data: UpdateVariationOptionInput): Promise<ProductEntity> {
    await this.variationRepository.updateVariationOptionById(data);
    return await this.productRepository.getProductById(data.productId);
  }
}
