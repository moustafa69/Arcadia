import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { RedisService } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserAccessTokenPayload } from '../interfaces/access-token-payload.interface';

@Injectable()
export class AccessTokenUserStrategy extends PassportStrategy(
  Strategy,
  'at-user',
) {
  protected redis: Redis;
  constructor(
    private readonly _config: ConfigService,
    private prisma: PrismaService,
    protected redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _config.get('USER_JWT_SECRET'),
    });
    this.redis = redisService.getClient();
  }

  async validate(payload: UserAccessTokenPayload) {
    const userSession = await this.redis.get(payload.id);
    if (!userSession) throw new UnauthorizedException('Session Expired');
    return payload;
  }
}
