export class AddressEntity {
  id: number;
  countryId: number;
  street_number: string;
  address: string;
  city: string;
  region: string;
  postal_code: string;
}

export class CountryEntity {
  id: number;
  country_name: string;
}
