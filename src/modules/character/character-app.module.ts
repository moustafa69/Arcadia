import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';
@Module({
  imports: [
    AdminModule,
    UserModule,
    RouterModule.register([{ path: 'characters/admin', module: AdminModule }]),
    RouterModule.register([{ path: 'character/user', module: UserModule }]),
  ],
  providers: [],
  exports: [],
})
export class CharacterAppModule {}
