import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export async function checkExistingUserFields(
  email: string,
  username: string,
  phone_number: string,
  tx: Prisma.TransactionClient,
) {
  const userExists = await tx.user.findFirst({
    where: {
      OR: [
        {
          email,
        },
        {
          username,
        },
        {
          phone_number,
        },
      ],
    },
  });

  if (userExists) {
    if (userExists.email === email)
      throw new BadRequestException(
        `This email "${email}" is already registered`,
      );

    if (userExists.username === username)
      throw new BadRequestException(
        `This username "${username}" is already registered`,
      );

    if (userExists.phone_number === phone_number)
      throw new BadRequestException(
        `This phone_number "${phone_number}" is already registered`,
      );
  }
}
