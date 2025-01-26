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
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetIdentity } from 'src/common/decorators';
import { AtGuard } from 'src/modules/Auth/admin/guards';
import { AdminIdentity } from 'src/modules/Auth/shared/identity';
import { AdminService } from './admin.service';
import { CreateGameDto } from './dto/create-game.dto';
import { GameIdParamDto } from './dto/game-id-param.dto';
import { ListGameQueryDto } from './dto/list-game-query.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@ApiTags('Game/admin')
@UseGuards(AtGuard)
@Controller({ version: VERSION_NEUTRAL })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @Post()
  async create(
    @GetIdentity() identity: AdminIdentity,
    @Body() body: CreateGameDto,
  ) {
    const data = await this.adminService.create(identity, body);
    return { Message: 'Game Created Successfully', data };
  }

  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: ListGameQueryDto) {
    const data = await this.adminService.findAll(query);
    return { Message: 'Success', data };
  }

  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param() param: GameIdParamDto) {
    const data = await this.adminService.findOne(param);
    return { Message: 'Success', data };
  }

  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param() param: GameIdParamDto,
    @Body() updateAdminDto: UpdateGameDto,
  ) {
    const data = await this.adminService.update(param, updateAdminDto);
    return { Message: 'Game Updated Successfully', data };
  }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param() param: GameIdParamDto) {
    await this.adminService.remove(param);
    return { Message: 'Game Deleted Successfully' };
  }
}
