import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ListAllAdminsQueryDto } from './dto/list-all-admins-query.dto';
import { AdminIdParamDto } from './dto/admin-id-param.dto';
import { RoleToPermissionsMap } from './utils';
import {
  IMailContent,
  MailService,
} from 'src/common/services/mail-service/mail.service';
import { adminCreationTemplate } from 'src/common/services/mail-service/templates/templates';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  async create({ email, username, password, name, role }: CreateAdminDto) {
    const admin = await this.prisma.admin.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
        deletedAt: null,
      },
    });

    if (admin) throw new UnauthorizedException('Admin Already exists');
    const permissions = RoleToPermissionsMap[role];
    const hashedPassword = await this.hashingPassword(password);
    await this.prisma.admin.create({
      data: {
        name,
        email,
        username,
        role,
        permissions,
        password: hashedPassword,
      },
    });
    const mssg: IMailContent = {
      email,
      subject: 'Arcadia Admin Account Creation',
      html: adminCreationTemplate(email, password),
    };
    await this.mailService.sendMail(mssg);
  }

  async listAllAdmins({ page, limit, role }: ListAllAdminsQueryDto) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.admin.findMany({
        skip,
        take: limit,
        where: role ? { role } : {},
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
        },
      }),
      this.prisma.admin.count(),
    ]);

    return {
      data,
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne({ id }: AdminIdParamDto) {
    try {
      const admin = await this.prisma.admin.findFirst({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });
      if (!admin) throw new NotFoundException('Admin Not Found');

      return admin;
    } catch (error) {
      throw error;
    }
  }

  async update(
    { id }: AdminIdParamDto,
    { name, username, email, password, role }: UpdateAdminDto,
  ) {
    try {
      const admin = await this.prisma.admin.findFirst({ where: { id } });
      if (!admin) throw new NotFoundException('Admin Not Found');

      const updatedAdmin = await this.prisma.admin.update({
        where: { id },
        data: { name, username, email, password, role },
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

  async delete({ id }: AdminIdParamDto) {
    try {
      const admin = await this.prisma.admin.findFirst({ where: { id } });
      if (!admin) throw new NotFoundException('Admin Not found');

      await this.prisma.admin.delete({ where: { id } });
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
