import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    //Import all modules
    AdminModule,
    UserModule,

    //Route all modules
    RouterModule.register([{ path: 'auth/admins', module: AdminModule }]),
    RouterModule.register([{ path: 'auth/users', module: UserModule }]),
  ],
  providers: [],
  exports: [],
})
export class AuthAppModule {}
