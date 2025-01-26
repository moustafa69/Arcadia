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
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { query } from 'express';
import { ListCharacterQueryDto } from './dto/list-all-characters-query.dto';
import { CharacterIdParamDto } from './dto/character-id-param.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/modules/Auth/admin/guards';
@ApiTags('characters/admin')
@UseGuards(AtGuard)
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @Post()
  async create(@Body() body: CreateCharacterDto) {
    const data = await this.adminService.create(body);
    return { Message: 'Character Created Successfully', data };
  }

  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: ListCharacterQueryDto) {
    const data = await this.adminService.findAll(query);
    return { Message: 'Success', data };
  }

  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param() param: CharacterIdParamDto) {
    const data = await this.adminService.findOne(param);
    return { Message: 'Success', data };
  }

  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param() param: CharacterIdParamDto,
    @Body() body: UpdateCharacterDto,
  ) {
    const data = await this.adminService.update(param, body);
    return { Message: 'Character Updated Successfully', data };
  }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param() param: CharacterIdParamDto) {
    await this.adminService.remove(param);
    return { Message: 'Character Deleted Successfully' };
  }
}
