import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MailService } from 'src/common/services/mail-service/mail.service';
import { SubAdminStrategy } from 'src/modules/admin/shared/strategies';

@Module({
  controllers: [AdminController],
  providers: [AdminService, MailService, SubAdminStrategy],
})
export class AdminModule {}
