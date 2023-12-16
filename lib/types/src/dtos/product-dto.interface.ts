import { CreateAttributeDTO } from './attribute-dto.interface';
import { CreateProductItemDTO } from './item-dto.interface';
import { CreateVariationDTO } from './variation-dto.interface';

export class CreateProductDTO {
  name: string;
  description: string;
  coverImage: string;
  image?: string[];
  available: boolean;
  categories?: string[];

  brand: string;
  attributes?: Omit<CreateAttributeDTO, 'productId'>[];
  variation?: Omit<CreateVariationDTO, 'productId'>[];
  productItem?: Omit<CreateProductItemDTO, 'productId'>[];
}

export class UpdateProductDTO {
  id: number;
  name?: string;
  brand?: string;
  description?: string;
  coverImage?: string;
  image?: string[];
  available?: boolean;
}

export class ProductCategoryDTO {
  name: string;
  productId: number;
}

export class FilterDTO {
  productItem?: {
    some: {
      price: {
        lte: number;
        gte: number;
      };
    };
  };
  product_category?: {
    every: {
      category: {
        name: string;
      };
    };
  };
  brand?: {
    name: string;
  };
  name?: string;
}
