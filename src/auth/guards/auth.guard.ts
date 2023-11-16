import { GqlExecutionContext } from '@nestjs/graphql';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { PrismaService } from 'src/prisma/prisma.service';

interface JWTPayload {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (roles?.length) {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();

      const token = req.headers.authorization?.split('Bearer ')[1];

      try {
        const payload = (await this.jwtService.verify(token, {
          secret: process.env.JSON_TOKEN_KEY,
        })) as JWTPayload;
        const user = await this.prisma.user.findUnique({
          where: {
            id: payload.id,
          },
        });

        if (!user) return false;

        req['user'] = user;
        if (roles.includes(user.user_type)) return true;

        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    return true;
  }
}
