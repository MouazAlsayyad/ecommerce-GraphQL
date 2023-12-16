import {
  ProductEntity,
  ProductRepository,
  UseCase,
  VariationRepository,
} from 'lib/types/src';
import { AddVariationOptionInput } from '../../dto/create-product.input';

export class AddVariationOptionUseCase
  implements UseCase<AddVariationOptionInput, Promise<ProductEntity>>
{
  constructor(
    private variationRepository: VariationRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(data: AddVariationOptionInput): Promise<ProductEntity> {
    await this.variationRepository.insertVariationOption(data);
    return await this.productRepository.getProductById(data.productId);
  }
}
