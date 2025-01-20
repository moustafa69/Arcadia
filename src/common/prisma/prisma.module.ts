import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AdminModule } from 'src/modules/Auth/admin/admin.module';
import { AdminService } from 'src/modules/Auth/admin/admin.service';

@Global()
@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
