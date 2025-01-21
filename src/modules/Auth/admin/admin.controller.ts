import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  VERSION_NEUTRAL,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LogniAdminDto } from './dto/login-admin.dto';
import { ResetPasswordAdminDto } from './dto/reset-password-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AtGuard, RtGuard } from './guards';
import { ForgetPasswordAdminDto } from './dto';
import { GetIdentity } from 'src/common/decorators';
import { identity } from 'rxjs';
import { AdminIdentity } from '../shared/identity';

@ApiTags('auth/admins')
@Controller({ path: 'admin', version: VERSION_NEUTRAL })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //will be used for one time to create the super admin only (not best practice i know!)

  @Post('public/signup')
  @HttpCode(HttpStatus.CREATED)
  async Register(@Body() body: RegisterAdminDto) {
    const data = await this.adminService.register(body);
    return { Message: 'Admin Created Successfully', data };
  }

  @Post('public/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LogniAdminDto) {
    const data = await this.adminService.login(body);
    return { Message: 'Logged in successfully', data };
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Body() { email }: ForgetPasswordAdminDto) {
    await this.adminService.forgetPassword(email);
    return { Message: 'Forget Mail Sent' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordAdminDto) {
    await this.adminService.resetPassword(body);
    return { Message: 'Password Reset Success' };
  }

  @UseGuards(RtGuard)
  @ApiBearerAuth()
  @Post('/refresh')
  async refreshTokens(@GetIdentity('refreshToken') refreshToken: string) {
    const data = await this.adminService.refreshTokens(refreshToken);
    return { Message: 'Tokens Refreshed Successfully', data };
  }

  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @Post('/logout')
  async logout(@GetIdentity() identity: AdminIdentity) {
    await this.adminService.logout(identity.id);
    return { Message: 'Logged Out Successfully' };
  }
}
