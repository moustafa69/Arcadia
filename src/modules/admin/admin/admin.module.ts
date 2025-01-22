import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SuperAdminStrategy } from '../shared/strategies/super-admin.strategy';
import { AccessTokenAdminStrategy } from 'src/modules/Auth/admin/strategies';
import { MailService } from 'src/common/services/mail-service/mail.service';
import { AdminProfileController } from '../admin-profile/admin-profile.controller';
import { AdminProfileService } from '../admin-profile/admin-profile.service';

@Module({
  imports: [],
  controllers: [AdminController],
  providers: [
    AdminService,
    SuperAdminStrategy,
    AccessTokenAdminStrategy,
    MailService,
  ],
})
export class AdminModule {}
