import {
  ProductEntity,
  ProductItemRepository,
  ProductRepository,
  UseCase,
} from 'lib/types/src';
import { AddProductItemInput } from '../../dto/create-product.input';

export class AddProductItemUseCase
  implements UseCase<AddProductItemInput, Promise<ProductEntity>>
{
  constructor(
    private itemRepository: ProductItemRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(data: AddProductItemInput): Promise<ProductEntity> {
    await this.itemRepository.addProductItem(data);
    return await this.productRepository.getProductById(data.productId);
  }
}
