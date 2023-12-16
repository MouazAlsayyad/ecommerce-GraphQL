export class CreateVariationDTO {
  productId: number;
  name: string;
  variationOption: Omit<CreateVariationOptionDTO, 'variationId'>[];
}

export class CreateVariationOptionDTO {
  variationId: number;
  value: string;
}

export class UpdateVariationDTO {
  productId: number;
  variationId: number;
  name: string;
}

export class UpdateVariationOptionDTO {
  id: number;
  productId: number;
  variationId: number;
  value: string;
}
