import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma/prisma.service';
@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const { email, password, username } = createAdminDto;
    const admin = await this.prisma.admin.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (admin) throw new UnauthorizedException('Admin Already exists');
    //const hashedPassword = await this.hashingPassword(password);
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

  private async hashingPassword(password: string): Promise<string> {
    const saltRounds = this.config.get('SALT_ROUNDS');
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
}
