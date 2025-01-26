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
import { ApiTags } from '@nestjs/swagger';
import { ListGuideQueryDto } from './dto/list-guide-query.dto';
import { GuideIdParamDto } from './dto/guide-id-param.dto';

@ApiTags('guides/user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() query: ListGuideQueryDto) {
    const data = await this.userService.findAll(query);
    return { Message: 'Success', data };
  }

  @Get(':id')
  async findOne(@Param() param: GuideIdParamDto) {
    const data = await this.userService.findOne(param);
    return { Message: 'Success', data };
  }
}
