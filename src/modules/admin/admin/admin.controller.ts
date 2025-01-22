import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListAllAdminsQueryDto } from './dto/list-all-admins-query.dto';
import { AdminIdParamDto } from './dto/admin-id-param.dto';
import { AtGuard } from 'src/modules/Auth/admin/guards';
import { SuperAdmin } from './guards/super-admin.guard';

@ApiTags('admins')
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AtGuard, SuperAdmin)
  @ApiBearerAuth()
  @Post()
  async create(@Body() body: CreateAdminDto) {
    await this.adminService.create(body);
    return {
      Message: 'Admin Created Successfully',
    };
  }

  @UseGuards(AtGuard, SuperAdmin)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: ListAllAdminsQueryDto) {
    const data = await this.adminService.listAllAdmins(query);
    return { Message: 'Success', data };
  }

  @UseGuards(AtGuard, SuperAdmin)
  @ApiBearerAuth()
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the admin',
    required: true,
  })
  async findOne(@Param() param: AdminIdParamDto) {
    const data = await this.adminService.findOne(param);
    return { Message: 'Success', data };
  }

  @UseGuards(AtGuard, SuperAdmin)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the admin',
    required: true,
  })
  update(@Param() param: AdminIdParamDto, @Body() body: UpdateAdminDto) {
    return this.adminService.update(param, body);
  }

  @UseGuards(AtGuard, SuperAdmin)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the admin',
    required: true,
  })
  async delete(@Param() param: AdminIdParamDto) {
    await this.adminService.delete(param);
    return { Message: 'Admin Deleted Successfully' };
  }
}
