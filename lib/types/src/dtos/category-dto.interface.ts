export class CreateCategoryDTO {
  name: string;
  description: string;
  image?: string;
}

export class UpdateCategoryDTO {
  id: number;
  name?: string;
  description?: string;
  image?: string;
}
