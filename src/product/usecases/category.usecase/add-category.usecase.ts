import { ProductRepository, UseCase } from 'lib/types/src';
import { ProductCategoryInput } from '../../dto/create-product.input';
import { Product } from 'src/product/entities/product.entity';

export class AddCategoryUseCase
  implements UseCase<ProductCategoryInput, Promise<Product>>
{
  constructor(private productRepository: ProductRepository) {}

  async execute(data: ProductCategoryInput): Promise<Product> {
    await this.productRepository.addCategoryToProduct(data);
    return await this.productRepository.getProductById(data.productId);
  }
}
