import { ProductAttributeEntity } from './attribute-entity.interface';
import { ProductItemEntity } from './item-entity.interface';
import { ReviewEntity } from './review-entity.interface';
import { VariationEntity } from './variation-entity.interface';

export interface ProductEntity {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  available: boolean;
  image?: string[];
  averageRating: number;
  reviewCount: number;
  categories?: CategoryProductEntity[];
  brand?: BrandProductEntity;
  attributes?: Omit<ProductAttributeEntity, 'productId'>[];
  variation?: VariationEntity[];
  productItem?: ProductItemEntity[];
  userReview?: ReviewEntity[];
}

export interface BrandProductEntity {
  id: number;
  name: string;
}

export interface CategoryProductEntity {
  id: number;
  name: string;
}
