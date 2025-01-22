import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  IMailContent,
  MailService,
} from 'src/common/services/mail-service/mail.service';
import { ListAllUsersQueryDto } from './dto/list-all-users-query.dto';
import { UserIdParamDto } from './dto/user-id-param.dto';
import { use } from 'passport';
import { Status, User } from '@prisma/client';
import {
  activateUserTemplate,
  suspendUserTemplate,
} from 'src/common/services/mail-service/templates/templates';
import { SuspendUserDto } from './dto/suspend-user.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}
  async findAll({ page, limit, status }: ListAllUsersQueryDto) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where: status ? { status, deletedAt: null } : { deletedAt: null },

        select: {
          id: true,
          name: true,
          username: true,
          status: true,
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

  async findOne({ id }: UserIdParamDto): Promise<Partial<User>> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        name: true,
        username: true,
        status: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User Not Found');

    return user;
  }

  async suspend(
    { id }: UserIdParamDto,
    { reason }: SuspendUserDto,
  ): Promise<Partial<User>> {
    const user = await this.prisma.user.update({
      where: { id, deletedAt: null },
      data: { status: Status.SUSPENDED },
    });

    if (!user) throw new NotFoundException('User not Found');

    const mssg: IMailContent = {
      email: user.email,
      subject: 'User Account Suspended',
      html: suspendUserTemplate(user.username, reason),
    };
    await this.mailService.sendMail(mssg);

    return {
      id,
      name: user.name,
      username: user.username,
      status: user.status,
    };
  }

  async activate({ id }: UserIdParamDto) {
    const user = await this.prisma.user.update({
      where: { id, deletedAt: null },
      data: { status: Status.ACTIVE },
    });
    if (!user) throw new NotFoundException('User not Found');

    const mssg: IMailContent = {
      email: user.email,
      subject: 'User Account Activated',
      html: activateUserTemplate(user.username),
    };
    await this.mailService.sendMail(mssg);

    return {
      id,
      name: user.name,
      username: user.username,
      status: user.status,
    };
  }

  async remove({ id }: UserIdParamDto) {
    const user = await this.prisma.user.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (!user) throw new NotFoundException('User not Found');
  }
}
