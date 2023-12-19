import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogInInput, SignInInput } from './dto/create-auth.input';
import { AuthResponse } from './entities/auth.entity';
import { getJwtToken } from './utils/create-jwt-token';
@Injectable()
export class PrismaAuthRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  singIn(data: SignInInput): Promise<AuthResponse> {
    const { email, username, phone_number, password } = data;
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: await bcryptjs.hash(password, 12),
          username,
          user_type: 'USER',
          phone_number,
        },
      });

      const token = await getJwtToken(this.jwtService, user.id);
      return { token };
    });
  }

  async login(data: LogInInput): Promise<AuthResponse> {
    const { email, password } = data;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcryptjs.compare(password, user.password)))
      throw new BadRequestException('Invalid credentials');

    if (user.isBlock) throw new BadRequestException('this email is "Block"');
    const token = await getJwtToken(this.jwtService, user.id);
    return { token };
  }
}
