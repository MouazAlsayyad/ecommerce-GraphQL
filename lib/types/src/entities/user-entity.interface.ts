import { UserType } from '@prisma/client';
import { AddressEntity } from './address-entity.interface';

export class UserEntity {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  user_type: UserType;
  isBlock: boolean;
  addresses?: AddressEntity[];
}
