import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  VERSION_NEUTRAL,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserIdParamDto } from './dto/user-id-param.dto';
import { ListAllUsersQueryDto } from './dto/list-all-users-query.dto';
import { AtGuard } from 'src/modules/Auth/admin/guards';
import { SubAdmin } from 'src/modules/admin/shared/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuspendUserDto } from './dto/suspend-user.dto';
@ApiTags('users/admin')
@Controller({ path: '', version: VERSION_NEUTRAL })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AtGuard, SubAdmin)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: ListAllUsersQueryDto) {
    const data = await this.adminService.findAll(query);
    return {
      Message: 'Success',
      data,
    };
  }

  @UseGuards(AtGuard, SubAdmin)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param() param: UserIdParamDto) {
    const data = await this.adminService.findOne(param);
    return {
      Message: 'Success',
      data,
    };
  }

  @UseGuards(AtGuard, SubAdmin)
  @ApiBearerAuth()
  @Patch(':id/suspend')
  async suspend(@Param() param: UserIdParamDto, @Body() body: SuspendUserDto) {
    const data = await this.adminService.suspend(param, body);
    return {
      Message: 'User Suspended Successfully',
      data,
    };
  }

  @UseGuards(AtGuard, SubAdmin)
  @ApiBearerAuth()
  @Patch(':id/activate')
  async activate(@Param() param: UserIdParamDto) {
    const data = await this.adminService.activate(param);
    return {
      Message: 'User Activated Successfully',
      data,
    };
  }

  @UseGuards(AtGuard, SubAdmin)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param() param: UserIdParamDto) {
    await this.adminService.remove(param);
    return {
      Message: 'User Deleted Successfully',
    };
  }
}
