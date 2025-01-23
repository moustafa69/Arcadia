import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AtGuard } from 'src/modules/Auth/admin/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { identity } from 'rxjs';
import { GetIdentity } from 'src/common/decorators';
import { AdminIdentity } from 'src/modules/Auth/shared/identity';
import { CategoryIdParamDto } from './dto/category-id-param.dto';
@ApiTags('category/admin')
@UseGuards(AtGuard)
@Controller({ version: VERSION_NEUTRAL })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @Post()
  async create(
    @GetIdentity() identity: AdminIdentity,
    @Body() body: CreateCategoryDto,
  ) {
    const data = await this.adminService.create(identity, body);
    return { Message: 'Category Created Successfully', data };
  }

  @ApiBearerAuth()
  @Get()
  async findAll() {
    const data = await this.adminService.findAll();
    return { Message: 'Success', data };
  }

  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param() param: CategoryIdParamDto) {
    const data = await this.adminService.findOne(param);
    return { Message: 'Success', data };
  }

  @ApiBearerAuth()
  @Get(':id/subs')
  async findSubs(@Param() param: CategoryIdParamDto) {
    const data = await this.adminService.findSubs(param);
    return { Message: 'Success', data };
  }

  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param() param: CategoryIdParamDto,
    @Body() body: UpdateCategoryDto,
  ) {
    const data = await this.adminService.update(param, body);
    return { Message: 'Category Updated Successfully', data };
  }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param() param: CategoryIdParamDto) {
    await this.adminService.remove(param);
    return { Message: 'Category Deleted Successfully' };
  }
}
