import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';
import { Router } from 'express';

@Module({
  imports: [
    AdminModule,
    UserModule,

    RouterModule.register([{ path: 'guides/admin', module: AdminModule }]),
    RouterModule.register([{ path: 'guides/user', module: UserModule }]),
  ],
  providers: [],
  exports: [],
})
export class GuideAppModule {}
