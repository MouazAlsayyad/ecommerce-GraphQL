import { ProductEntity } from './product-entity.interface';

export class CategoryEntity {
  id: number;
  name: string;
  description: string;
  image: string;
  product?: ProductEntity[];
}
