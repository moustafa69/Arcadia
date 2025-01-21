import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import e, { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { RefreshTokenPayload } from '../../shared/interfaces';

@Injectable()
export class RefreshTokenUserStrategy extends PassportStrategy(
  Strategy,
  'rt-user',
) {
  constructor(private _config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _config.get('USER_JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshTokenPayload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
