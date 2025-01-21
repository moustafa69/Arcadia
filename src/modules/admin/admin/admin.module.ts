import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SuperAdminStrategy } from './strategies/super-admin.strategy';
import { AccessTokenAdminStrategy } from 'src/modules/Auth/admin/strategies';

@Module({
  imports: [],
  controllers: [AdminController],
  providers: [AdminService, SuperAdminStrategy, AccessTokenAdminStrategy],
})
export class AdminModule {}
