import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/common/services/mail-service/mail.service';
import {
  AccessTokenUserStrategy,
  RefreshTokenUserStrategy,
} from './strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [
    UserService,
    MailService,
    AccessTokenUserStrategy,
    RefreshTokenUserStrategy,
  ],
})
export class UserModule {}
