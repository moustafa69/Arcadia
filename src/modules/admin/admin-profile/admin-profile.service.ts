import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminIdParamDto } from './dto/admin-id-param.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { ConfigService } from '@nestjs/config';
import { AdminIdentity } from 'src/modules/Auth/shared/identity';
import * as bcrypt from 'bcrypt';
import { ChangePasswordAdminDto } from './dto/change-password.dto';

@Injectable()
export class AdminProfileService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async getProfile({ id }: AdminIdentity) {
    const admin = await this.prisma.admin.findFirst({
      where: { id },
      select: { name: true, username: true, email: true, role: true },
    });
    if (!admin) throw new NotFoundException('Admin Not Found');

    return admin;
  }

  async updateProfile(
    { id }: AdminIdentity,
    { name, email, username }: UpdateAdminProfileDto,
  ) {
    try {
      const admin = await this.prisma.admin.findFirst({ where: { id } });
      if (!admin) throw new NotFoundException('Admin Not Found');

      const updatedAdmin = await this.prisma.admin.update({
        where: { id },
        data: { name, email, username },
        select: {
          name: true,
          username: true,
          email: true,
          role: true,
        },
      });
      return updatedAdmin;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    { id }: AdminIdentity,
    { oldPassword, newPassword }: ChangePasswordAdminDto,
  ) {
    try {
      const admin = await this.prisma.admin.findFirst({ where: { id } });
      if (!admin) throw new NotFoundException('Admin Not Found');

      if (oldPassword === newPassword)
        throw new ConflictException('Passwords are the same');

      if ((await this.hashingPassword(oldPassword)) !== admin.password)
        throw new BadRequestException('Invalid Old Password');

      const newHashedPassword = await this.hashingPassword(newPassword);
      await this.prisma.admin.update({
        where: { id },
        data: { password: newHashedPassword },
      });
    } catch (error) {
      throw error;
    }
  }

  private async hashingPassword(password: string): Promise<string> {
    const saltRounds = Number(this.config.get('SALT_ROUNDS'));
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
}
