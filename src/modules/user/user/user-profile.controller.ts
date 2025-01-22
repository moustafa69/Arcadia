import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { UserProfileService } from './user-profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/modules/Auth/user/guards';
import { GetIdentity } from 'src/common/decorators';
import { UserIdentity } from 'src/modules/Auth/shared/identity';
import { ChangePasswordUserDto } from './dto/change-user-password.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@ApiTags('users/user')
@Controller()
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @Get()
  async getProfile(@GetIdentity() identity: UserIdentity) {
    const data = await this.userProfileService.getProfile(identity);
    return { Message: 'Success', data };
  }

  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @Patch()
  async updateProfile(
    @GetIdentity() identity: UserIdentity,
    @Body() body: UpdateUserProfileDto,
  ) {
    const data = await this.userProfileService.updateProfile(identity, body);
    return { Message: 'Profile Updated Successfully', data };
  }

  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @Patch('change-password')
  async changePassword(
    @GetIdentity() identity: UserIdentity,
    @Body() body: ChangePasswordUserDto,
  ) {
    await this.userProfileService.changePassword(identity, body);
    return { Message: 'Password Updated Successfully' };
  }
}
