import { Module } from '@nestjs/common';
import { UserProfileModule } from './user/user-profile.module';
import { AdminModule } from './admin/admin.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    UserProfileModule,
    AdminModule,
    RouterModule.register([{ path: 'users/admin', module: AdminModule }]),
    RouterModule.register([{ path: 'users/user', module: UserProfileModule }]),
  ],
  providers: [],
  exports: [],
})
export class UserAppModule {}
