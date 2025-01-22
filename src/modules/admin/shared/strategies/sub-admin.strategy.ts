import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminAccessTokenPayload } from 'src/modules/Auth/admin/interfaces';

@Injectable()
export class SubAdminStrategy extends PassportStrategy(Strategy, 'sub-admin') {
  constructor(private readonly _config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _config.get('ADMIN_JWT_SECRET'),
    });
  }

  // checking if the Role of the admin is not a moderator (gives acces to super and sub only)
  async validate(payload: AdminAccessTokenPayload) {
    if (payload.role === Role.MODERATOR)
      throw new UnauthorizedException(
        'Access Denied, You are not a super nor sub',
      );
    return payload;
  }
}
