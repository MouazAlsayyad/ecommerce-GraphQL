import { UserType } from '@prisma/client';

export interface ContextType {
  req: {
    user: {
      user_type: UserType;
      id: number;
    };
  };
}
