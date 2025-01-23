import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AccessTokenAdminStrategy } from 'src/modules/Auth/admin/strategies';

@Module({
  controllers: [AdminController],
  providers: [AdminService, AccessTokenAdminStrategy],
})
export class AdminModule {}
