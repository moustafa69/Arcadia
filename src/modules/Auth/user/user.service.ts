import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Status, User } from '@prisma/client';
import { RedisService } from '@songkeys/nestjs-redis';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MailService } from 'src/common/services/mail-service/mail.service';
import {
  resetPasswordTemplate,
  verifyEmailTemplate,
} from 'src/common/services/mail-service/templates/templates';
import { v4 as uuidV4, v5 as uuidV5 } from 'uuid';
import { tokens } from '../shared/types';
import { ForgetPasswordUserDto } from './dto/forget-password-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { VerifyUserAccountDto } from './dto/verify-user-account.dto';
import { LoginUserReturn } from './interfaces/login-user-return.interface';
import { VerifyUserReturn } from './interfaces/verify-user-return.interface';
import { RefreshTokenPayload } from '../shared/interfaces';

@Injectable()
export class UserService {
  protected readonly redis: Redis;

  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    protected readonly redisService: RedisService,
    private mailService: MailService,
  ) {
    this.redis = redisService.getClient();
  }
  async register({
    name,
    username,
    email,
    password,
    picture,
    dob,
  }: RegisterUserDto) {
    try {
      const hashedPassword = await this.hashData(password);
      const user = await this.prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
          picture,
          DOB: dob,
        },
      });
      const userId = user.id;
      const tokens = await this.generateTokens(user);
      const code = await this.generateVerifyCode(email);
      const mssg = {
        email,
        subject: 'Arcadia App Account Verification',
        html: verifyEmailTemplate(code),
      };
      await this.mailService.sendMail(mssg);

      return { user: userId, ...tokens };
    } catch (error) {
      throw new Error(
        error.message || 'An unexpected error occurred during registration',
      );
    }
  }

  async verifyAccount({
    email,
    code,
  }: VerifyUserAccountDto): Promise<VerifyUserReturn> {
    const isMatch =
      code.toString() === (await this.redis.get(`VERIFY-CODE-${email}`));
    if (isMatch) {
      try {
        const updatedUser = await this.prisma.user.update({
          where: { email },
          data: { status: Status.ACTIVE },
        });

        return {
          id: updatedUser.id,
          name: updatedUser.name,
          status: updatedUser.status,
        };
      } catch (error) {
        if (error.code === 'P2025')
          throw new NotFoundException('User not fouund');
        throw new BadRequestException('Verify User denied');
      }
    }
    throw new Error('Wrong Verification Code');
  }
  async login({ email, password }: LoginUserDto): Promise<LoginUserReturn> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (!user) throw new UnauthorizedException('Wrong Email or Password');

    if (user.status !== Status.ACTIVE)
      throw new UnauthorizedException('Access Denied');

    const isPasswordsMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordsMatch)
      throw new UnauthorizedException('Wrong Email or Password');

    const userId = user.id;
    const session = await this.redis.get(userId);

    const tokens = await this.generateTokens(user, session);
    return { user: userId, ...tokens };
  }
  async refreshTokens(refreshToken: string): Promise<tokens> {
    const payload: RefreshTokenPayload = await this.jwtService.verify(
      refreshToken,
      {
        secret: this.config.get('USER_JWT_REFRESH_SECRET'),
      },
    );
    const user = await this.prisma.user.findFirst({
      where: { id: payload.id, deletedAt: null, status: Status.ACTIVE },
    });

    const tokens = await this.generateTokens(user);
    return tokens;
  }
  async forgetPassword({ email }: ForgetPasswordUserDto) {
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

  async resetPassword({ code, email, newPassword }: ResetPasswordUserDto) {
    const isMatch =
      (await this.redis.get(`RESET-CODE-${email}`)) === code.toString();
    if (!isMatch) throw new UnauthorizedException('Invalid Code');
    try {
      await this.prisma.user.update({
        where: { email },
        data: { password: await this.hashData(newPassword) },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User Not Found');
      }
      throw error;
    }
  }

  async logout(userId: string) {
    await this.redis.del(userId);
  }

  private async generateTokens(
    { id, name, email, status }: User,
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
          status,
          sessionId,
        },
        {
          secret: this.config.get('USER_JWT_SECRET'),
          expiresIn: this.config.get('USER_JWT_EXPIRY'),
        },
      ),
      this.jwtService.signAsync(
        {
          id,
          sessionId,
          status,
          email,
        },
        {
          secret: this.config.get('USER_JWT_REFRESH_SECRET'),
          expiresIn: this.config.get('USER_JWT_REFRESH_EXPIRY') || 7200,
        },
      ),
    ]);

    return { accessToken, refreshToken, sessionId };
  }

  private async createSession(userId: string) {
    const session = uuidV5(uuidV4(), uuidV4());
    await this.redis.set(userId?.toString(), session, 'EX', 86400);

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
  private async generateVerifyCode(email: string): Promise<number> {
    const Code = Math.floor(100000 + Math.random() * 900000);
    this.redis.set(`VERIFY-CODE-${email}`, Code, 'EX', 300);

    return Code;
  }
}
