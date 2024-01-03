import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export async function checkImage(
  path: string,
  prisma: Prisma.TransactionClient,
) {
  const image = await prisma.image.findFirst({ where: { path } });
  if (!image) {
    throw new NotFoundException(`The image link is incorrect ${path}`);
  }
}
