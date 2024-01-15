import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
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

export async function checkAddress(
  id: number,
  userId: number,
  tx: Prisma.TransactionClient,
) {
  const address = await tx.address.findUnique({ where: { id } });
  if (!address) throw new NotFoundException(`address with ID ${id} not found`);

  if (address.userId !== userId)
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}

export async function checkCountryByName(
  countryName: string,
  tx: Prisma.TransactionClient,
) {
  const country = await tx.country.findFirst({
    where: { countryName },
  });
  if (country)
    throw new BadRequestException(
      `country with name ${countryName} is already exists`,
    );
}
