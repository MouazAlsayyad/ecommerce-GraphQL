export class CreateAttributeDTO {
  productId: number;
  name: string;
  value: string;
}

export class UpdateAttributeDTO {
  productId: number;
  attributeId: number;
  name?: string;
  value?: string;
}
