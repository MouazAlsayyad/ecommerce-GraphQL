export class CreateProductItemDTO {
  productId: number;
  SKU: string;
  qtyInStock: number;
  price: number;
  variationsItem?: CreateVariationItemDTO[];
}

export class CreateVariationItemDTO {
  nameVariation: string;
  valueVariation: string;
}

export class UpdateProductItemDTO {
  productId: number;
  productItemId: number;
  SKU?: string;
  qtyInStock?: number;
  price?: number;
  variationsItem?: UpdateVariationItemDTO[];
}

export class UpdateVariationItemDTO {
  nameVariation: string;
  valueVariation: string;
}
