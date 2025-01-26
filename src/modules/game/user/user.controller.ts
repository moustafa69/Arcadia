import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GameIdParamDto } from './dto/game-id-param.dto';
import { query } from 'express';
import { ListGameQueryDto } from './dto/list-game-query.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('game/user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() query: ListGameQueryDto) {
    const data = await this.userService.findAll(query);
    return { Message: 'Success', data };
  }

  @Get(':id')
  async findOne(@Param() param: GameIdParamDto) {
    const data = await this.userService.findOne(param);
    return { Message: 'Success', data };
  }

  @Get(':id/characters')
  async findGameCharacters(@Param() param: GameIdParamDto) {
    const data = await this.userService.findGameCharacters(param);
    return { Message: 'Success', data };
  }

  @Get(':id/guides')
  async findGameGuides(@Param() param: GameIdParamDto) {
    const data = await this.userService.findGameGuides(param);
    return { Message: 'Success', data };
  }
}
