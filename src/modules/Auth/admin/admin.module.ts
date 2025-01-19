import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import {
  AccessTokenAdminStrategy,
  RefreshTokenAdminStrategy,
} from './strategies';
import { MailService } from 'src/common/services/mail-service/mail.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AdminController],
  providers: [
    AdminService,
    AccessTokenAdminStrategy,
    RefreshTokenAdminStrategy,
    MailService,
  ],
})
export class AdminModule {}
