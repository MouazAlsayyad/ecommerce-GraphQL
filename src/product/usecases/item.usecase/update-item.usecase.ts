import {
  ProductEntity,
  ProductItemRepository,
  ProductRepository,
  UseCase,
} from 'lib/types/src';
import { UpdateProductItemInput } from '../../dto/update-product.input';

export class UpdateProductItemUseCase
  implements UseCase<UpdateProductItemInput, Promise<ProductEntity>>
{
  constructor(
    private itemRepository: ProductItemRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(data: UpdateProductItemInput): Promise<ProductEntity> {
    await this.itemRepository.updateProductItem(data);
    return await this.productRepository.getProductById(data.productId);
  }
}
