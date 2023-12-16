import { UserType } from '@prisma/client';

export class CreateUserDTO {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  user_type: UserType;
}
