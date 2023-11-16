import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginInput, SignInInput } from './dto/create-auth.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(id: number) {
    return this.jwtService.signAsync(
      { id },
      {
        secret: process.env.JSON_TOKEN_KEY,
      },
    );
  }

  private async checkExistingUserFields(
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

  singIn(singInInput: SignInInput) {
    return this.prisma.$transaction(async (tx) => {
      await this.checkExistingUserFields(
        singInInput.email,
        singInInput.username,
        singInInput.phone_number,
        tx,
      );
      const user = await tx.user.create({
        data: {
          email: singInInput.email,
          password: await bcryptjs.hash(singInInput.password, 12),
          username: singInInput.username,
          user_type: 'USER',
          phone_number: singInInput.phone_number,
          isBlock: false,
        },
      });

      const token = this.getJwtToken(user.id);
      return { token, user };
    });
  }

  async login(loginInput: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginInput.email,
      },
    });
    if (!user || !(await bcryptjs.compare(loginInput.password, user.password)))
      throw new BadRequestException('Invalid credentials');
    if (user.isBlock) throw new BadRequestException('this email is "Block"');
    const token = this.getJwtToken(user.id);
    return {
      token,
      user,
    };
  }
}
//
