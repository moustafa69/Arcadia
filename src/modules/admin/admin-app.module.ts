import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    //Register all modules

    AdminModule,

    //Route all modules

    RouterModule.register([{ path: 'admins', module: AdminModule }]),
  ],
  providers: [],
  exports: [],
})
export class AdminAppModule {}
