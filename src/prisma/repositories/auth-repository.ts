import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository, LoginDTO, SignInDTO } from 'lib/types/src';
import { checkExistingUserFields } from '../utils/user-service-utils';
import * as bcryptjs from 'bcryptjs';
import { AuthEntity } from 'lib/types/src/entities/auth-entity.interface';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  singIn(data: SignInDTO): Promise<AuthEntity> {
    const { email, username, phone_number, password } = data;
    return this.prisma.$transaction(async (tx) => {
      await checkExistingUserFields(email, username, phone_number, tx);
      const user = await tx.user.create({
        data: {
          email,
          password: await bcryptjs.hash(password, 12),
          username,
          user_type: 'USER',
          phone_number,
        },
      });

      const token = await this.getJwtToken(user.id);
      return { token };
    });
  }
  async login(data: LoginDTO): Promise<AuthEntity> {
    const { email, password } = data;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcryptjs.compare(password, user.password)))
      throw new BadRequestException('Invalid credentials');

    if (user.isBlock) throw new BadRequestException('this email is "Block"');
    const token = await this.getJwtToken(user.id);
    return { token };
  }

  private getJwtToken(id: number): Promise<string> {
    return this.jwtService.signAsync(
      { id },
      {
        secret: process.env.JSON_TOKEN_KEY,
      },
    );
  }
}
