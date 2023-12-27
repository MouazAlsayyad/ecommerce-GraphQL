import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthMiddleware.name);

  async use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (token) {
      try {
        const payload = await this.jwtService.verify(token);
        const user = await this.prisma.user.findUnique({
          where: {
            id: payload.id,
          },
        });

        if (user) {
          const ctx = GqlExecutionContext.create({} as ExecutionContext);
          const gqlContext = GqlExecutionContext.create(ctx);
          const graphqlReq = gqlContext.getContext().req;

          graphqlReq['user'] = user;
        }
      } catch (error) {
        // this.logger.error(error);
      }
    }

    next();
  }
}
