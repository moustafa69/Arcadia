import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AdminModule,
    UserModule,
    RouterModule.register([{ path: 'category/admin', module: AdminModule }]),
    RouterModule.register([{ path: 'category/user', module: UserModule }]),
  ],
  providers: [],
  exports: [],
})
export class CategoryAppModule {}
