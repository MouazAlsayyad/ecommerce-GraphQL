import { JwtService } from '@nestjs/jwt';

export function getJwtToken(
  jwtService: JwtService,
  id: number,
): Promise<string> {
  return jwtService.signAsync({ id }, { secret: process.env.JSON_TOKEN_KEY });
}
