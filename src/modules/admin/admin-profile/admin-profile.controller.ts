import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminProfileService } from './admin-profile.service';
import { AtGuard } from 'src/modules/Auth/admin/guards';
import { GetIdentity } from 'src/common/decorators';
import { AdminIdParamDto } from './dto/admin-id-param.dto';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { AdminIdentity } from 'src/modules/Auth/shared/identity';
import { ChangePasswordAdminDto } from './dto/change-password.dto';
import { identity } from 'rxjs';

@ApiTags('admin-profile')
@Controller({ version: VERSION_NEUTRAL })
export class AdminProfileController {
  constructor(private adminProfileService: AdminProfileService) {}

  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @Get()
  async getProfile(@GetIdentity() identity: AdminIdentity) {
    const data = await this.adminProfileService.getProfile(identity);
    return { Message: 'Success', data };
  }

  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @Patch()
  async updateProfile(
    @GetIdentity() identity: AdminIdentity,
    @Body() body: UpdateAdminProfileDto,
  ) {
    const data = await this.adminProfileService.updateProfile(identity, body);
    return { Message: 'Profile Updated Successfully', data };
  }

  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @Patch('change-password')
  async changePassword(
    @GetIdentity() identity: AdminIdentity,
    @Body() body: ChangePasswordAdminDto,
  ) {
    await this.adminProfileService.changePassword(identity, body);
    return { Message: 'Password Updated Successfully' };
  }
}
