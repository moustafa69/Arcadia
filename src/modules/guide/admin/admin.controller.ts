import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetIdentity } from 'src/common/decorators';
import { AtGuard } from 'src/modules/Auth/admin/guards';
import { AdminIdentity } from 'src/modules/Auth/shared/identity';
import { AdminService } from './admin.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { GuideIdParamDto } from './dto/guide-id-param.dto';
import { ListGuideQueryDto } from './dto/list-guide-query.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { GalleryDto } from './dto/gallery.dto';

@ApiTags('guides/admin')
@UseGuards(AtGuard)
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @Post()
  async create(
    @GetIdentity() identity: AdminIdentity,
    @Body() body: CreateGuideDto,
  ) {
    const data = await this.adminService.create(identity, body);
    return { Message: 'Guide Created Successfully', data };
  }

  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: ListGuideQueryDto) {
    const data = await this.adminService.findAll(query);
    return { Message: 'Success', data };
  }

  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param() param: GuideIdParamDto) {
    const data = await this.adminService.findOne(param);

    return { Message: 'Success', data };
  }

  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param() param: GuideIdParamDto, @Body() body: UpdateGuideDto) {
    const data = await this.adminService.update(param, body);
    return { Message: 'Guide Updated Successfully', data };
  }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param() param: GuideIdParamDto) {
    await this.adminService.remove(param);
    return { Message: 'Guide Deleted Successfully' };
  }

  @ApiBearerAuth()
  @Patch(':id/gallery-add')
  async addToGallery(
    @Param() param: GuideIdParamDto,
    @Body() body: GalleryDto,
  ) {
    const data = await this.adminService.addToGallery(param, body);
    return { Message: 'Guide Updated Successfully', data };
  }

  @ApiBearerAuth()
  @Patch(':id/gallery-remove')
  async removeFromGallery(
    @Param() param: GuideIdParamDto,
    @Body() body: GalleryDto,
  ) {
    const data = await this.adminService.removeFromGallery(param, body);
    return { Message: 'Guide Updated Successfully', data };
  }
}
