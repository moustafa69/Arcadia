import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminAccessTokenPayload } from 'src/modules/Auth/admin/interfaces';

@Injectable()
export class SuperAdminStrategy extends PassportStrategy(
  Strategy,
  'super-admin',
) {
  constructor(private readonly _config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _config.get('ADMIN_JWT_SECRET'),
    });
  }

  async validate(payload: AdminAccessTokenPayload) {
    if (payload.role !== Role.SUPER_ADMIN)
      throw new UnauthorizedException('Access Denied, You are not a super');
    return payload;
  }
}
