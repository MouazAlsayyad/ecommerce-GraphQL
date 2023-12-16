import {
  ProductItemRepository,
  ProductRepository,
  UseCase,
} from 'lib/types/src';
import { Product } from 'src/product/entities/product.entity';

export class DeleteProductItemUseCase
  implements UseCase<number, Promise<Product>>
{
  constructor(
    private itemRepository: ProductItemRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(itemId: number): Promise<Product> {
    const id = await this.itemRepository.deleteProductItem(itemId);
    return this.productRepository.getProductById(id);
  }
}
