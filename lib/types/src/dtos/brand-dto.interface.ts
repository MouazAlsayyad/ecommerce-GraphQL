export class CreateBrandDTO {
  name: string;
  description: string;
  image?: string;
}

export class UpdateBrandDTO {
  id: number;
  name?: string;
  description?: string;
  image?: string;
}

export class AddCategoriesToBrandDTO {
  brandId: number;
  categories: string[];
}

export class RemoveCategoryFromBrandDTO {
  brandId: number;
  categoryId: number;
}
