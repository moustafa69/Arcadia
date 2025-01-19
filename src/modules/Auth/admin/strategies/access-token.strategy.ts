import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { RedisService } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AdminAccessTokenPayload } from '../interfaces/access-token-strategy-payload.interface';

@Injectable()
export class AccessTokenAdminStrategy extends PassportStrategy(
  Strategy,
  'at-admin',
) {
  protected redis: Redis;
  constructor(
    private readonly _config: ConfigService,
    private prisma: PrismaService,
    protected redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _config.get('ADMIN_JWT_SECRET'),
    });
    this.redis = redisService.getClient();
  }

  async validate(payload: AdminAccessTokenPayload) {
    const adminSession = await this.redis.get(payload.id);
    if (!adminSession) throw new UnauthorizedException('Session Expired');
    return payload;
  }
}
