export interface ProductItemEntity {
  id: number;
  SKU: string;
  qtyInStock: number;
  price: number;
  variationsItem?: VariationItemEntity[];
}

export interface VariationItemEntity {
  nameVariation: string;
  valueVariation: string;
}
