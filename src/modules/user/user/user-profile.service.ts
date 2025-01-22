import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserIdentity } from 'src/modules/Auth/shared/identity';
import { ChangePasswordUserDto } from './dto/change-user-password.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserProfileService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}
  async getProfile({ id }: UserIdentity) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        status: true,
        DOB: true,
        picture: true,
      },
    });
    if (!user) throw new NotFoundException('user Not Found');

    return user;
  }

  async updateProfile(
    { id }: UserIdentity,
    { name, email, username }: UpdateUserProfileDto,
  ) {
    try {
      const user = await this.prisma.user.findFirst({ where: { id } });
      if (!user) throw new NotFoundException('user Not Found');

      const updateduser = await this.prisma.user.update({
        where: { id },
        data: { name, email, username },
        select: {
          name: true,
          username: true,
          email: true,
          status: true,
        },
      });
      return updateduser;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    { id }: UserIdentity,
    { oldPassword, newPassword }: ChangePasswordUserDto,
  ) {
    try {
      const user = await this.prisma.user.findFirst({ where: { id } });
      if (!user) throw new NotFoundException('user Not Found');

      if (oldPassword === newPassword)
        throw new ConflictException('Passwords are the same');

      if ((await this.hashingPassword(oldPassword)) !== user.password)
        throw new BadRequestException('Invalid Old Password');

      const newHashedPassword = await this.hashingPassword(newPassword);
      await this.prisma.user.update({
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
