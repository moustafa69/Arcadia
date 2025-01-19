import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LogniAdminDto } from './dto/login-admin.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Admin, Permissions, Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { tokens } from './types';
import Redis from 'ioredis';
import { v4 as uuidV4, v5 as uuidV5 } from 'uuid';
import { ResetPasswordAdminDto } from './dto';
import { RedisService } from '@songkeys/nestjs-redis';
import { RefreshTokenPayload } from './interfaces';
import { MailService } from '../../../common/services/mail-service/mail.service';
import { resetPasswordTemplate } from 'src/common/services/mail-service/templates/templates';

@Injectable()
export class AdminService {
  protected readonly redis: Redis;
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    protected readonly redisService: RedisService,
    private mailService: MailService,
  ) {
    this.redis = redisService.getClient();
  }
  async register({ name, username, email, password }: RegisterAdminDto) {
    if (await this.checkSuper())
      throw new UnauthorizedException('Super Admin Already Exists');

    const hashedPassword = await this.hashData(password);
    const admin = await this.prisma.admin.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        permissions: [
          Permissions.MANAGE_ADMINS,
          Permissions.MANAGE_GAMES,
          Permissions.MANAGE_GUIDES,
          Permissions.MANAGE_USERS,
        ],
      },
    });
    const adminId = admin.id;
    const tokens = await this.generateTokens(admin);

    return { admin: adminId, ...tokens };
  }

  async login({ email, password }: LogniAdminDto) {
    const admin = await this.prisma.admin.findFirst({
      where: { email, deletedAt: null },
    });
    if (!admin) throw new UnauthorizedException('Wrong Email or Password');

    const isPasswordsMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordsMatch)
      throw new UnauthorizedException('Wrong Email or Password');

    const adminId = admin.id;
    const session = await this.redis.get(adminId);

    const tokens = await this.generateTokens(admin, session);
    return { admin: adminId, ...tokens };
  }

  async forgetPassword(email: string) {
    const code = await this.generateResetCode(email);
    const mssg = {
      email,
      subject: 'Arcadia App Account Password Reset',

      html: resetPasswordTemplate(code),
    };
    try {
      await this.mailService.sendMail(mssg);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword({ code, email, newPassword }: ResetPasswordAdminDto) {
    const isMatch =
      (await this.redis.get(`RESET-CODE-${email}`)) === code.toString();
    if (!isMatch) throw new UnauthorizedException('Invalid Code');
    try {
      await this.prisma.admin.update({
        where: { email },
        data: { password: await this.hashData(newPassword) },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Admin Not Found');
      }
      throw error;
    }
  }

  async refreshTokens(refreshToken: string) {
    const payload: RefreshTokenPayload = await this.jwtService.verify(
      refreshToken,
      {
        secret: this.config.get('ADMIN_JWT_REFRESH_SECRET'),
      },
    );
    const admin = await this.prisma.admin.findFirst({
      where: { id: payload.id },
    });

    const tokens = await this.generateTokens(admin);
    return tokens;
  }

  async logout(adminId: string) {
    await this.redis.del(adminId);
  }

  private async generateTokens(
    { id, name, email, role }: Admin,
    exsistingSession?: string,
  ): Promise<tokens> {
    //checking session exsistance and creating a new one

    const sessionId = exsistingSession
      ? exsistingSession
      : await this.createSession(id);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          name,
          email,
          role,
          sessionId,
        },
        {
          secret: this.config.get('ADMIN_JWT_SECRET'),
          expiresIn: this.config.get('ADMIN_JWT_EXPIRY'),
        },
      ),
      this.jwtService.signAsync(
        {
          id,
          sessionId,
          email,
        },
        {
          secret: this.config.get('ADMIN_JWT_REFRESH_SECRET'),
          expiresIn: this.config.get('ADMIN_JWT_REFRESH_EXPIRY') || 7200,
        },
      ),
    ]);

    return { accessToken, refreshToken, sessionId };
  }

  private async checkSuper(): Promise<boolean> {
    const admin = await this.prisma.admin.findFirst({
      where: { role: Role.SUPER_ADMIN },
    });
    return !!admin;
  }

  private async createSession(adminId: string) {
    const session = uuidV5(uuidV4(), uuidV4());
    await this.redis.set(adminId?.toString(), session, 'EX', 86400);

    return session;
  }
  private async hashData(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(Number(this.config.get('SALT_ROUNDS')));
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  private async generateResetCode(email: string): Promise<number> {
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    this.redis.set(`RESET-CODE-${email}`, resetCode, 'EX', 300);

    return resetCode;
  }
}
