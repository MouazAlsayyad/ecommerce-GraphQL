import { CategoryEntity } from './category-entity.interface';

export class BrandEntity {
  id: number;
  name: string;
  description: string;
  image: string;
  category?: CategoryEntity[];
}
