import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { RouterModule } from '@nestjs/core';
import { AdminProfileModule } from './admin-profile/admin-profile.module';

@Module({
  imports: [
    //Register all modules

    AdminModule,
    AdminProfileModule,
    //Route all modules

    RouterModule.register([{ path: 'admins/admin', module: AdminModule }]),
    RouterModule.register([
      { path: 'admin-profile/admin', module: AdminProfileModule },
    ]),
  ],
  providers: [],
  exports: [],
})
export class AdminAppModule {}
