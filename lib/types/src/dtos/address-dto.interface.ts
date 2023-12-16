export class CreateAddressDTO {
  userId: number;
  countryId: number;
  street_number: string;
  address: string;
  city: string;
  region: string;
  postal_code: string;
}

export class CreateCountryDTO {
  country_name: string;
}

export class UpdateAddressDTO {
  id: number;
  userId: number;
  countryId?: number;
  street_number?: string;
  address?: string;
  city?: string;
  region?: string;
  postal_code?: string;
}
