import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VerifyUserAccountDto } from './dto/verify-user-account.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgetPasswordUserDto } from './dto/forget-password-user.dto';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { GetIdentity } from 'src/common/decorators';
import { UserIdentity } from '../shared/identity';
import { AtGuard, RtGuard } from './guards';

@ApiTags('auth/users')
@Controller({ path: 'user', version: VERSION_NEUTRAL })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('public/signup')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto) {
    const data = await this.userService.register(body);
    return { Message: 'User Created Successfully', data };
  }
  @Post('verify-account')
  @HttpCode(HttpStatus.OK)
  async verifyAccount(@Body() body: VerifyUserAccountDto) {
    const data = await this.userService.verifyAccount(body);
    return { Message: 'Account Verified Successfully', data };
  }

  @Post('public/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginUserDto) {
    const data = await this.userService.login(body);
    return { Message: 'Logged in successfully', data };
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Body() body: ForgetPasswordUserDto) {
    await this.userService.forgetPassword(body);
    return { Message: 'Forget Mail Sent' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordUserDto) {
    await this.userService.resetPassword(body);
    return { Message: 'Password Reset Success' };
  }

  @UseGuards(RtGuard)
  @ApiBearerAuth()
  @Post('/refresh')
  async refreshTokens(@GetIdentity('refreshToken') refreshToken: string) {
    const data = await this.userService.refreshTokens(refreshToken);
    return { Message: 'Tokens Refreshed Successfully', data };
  }

  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @Post('/logout')
  async logout(@GetIdentity() identity: UserIdentity) {
    await this.userService.logout(identity.id);
    return { Message: 'Logged Out Successfully' };
  }
}
