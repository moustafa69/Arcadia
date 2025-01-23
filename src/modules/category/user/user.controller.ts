import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';

import { ApiTags } from '@nestjs/swagger';
import { CategoryIdParamDto } from './dto/category-id-param.dto';

@ApiTags('category/user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return { Message: 'Success', data };
  }

  @Get(':id')
  async findOne(@Param() param: CategoryIdParamDto) {
    const data = await this.userService.findOne(param);
    return { Message: 'Success', data };
  }

  @Get(':id/subs')
  async findSubs(@Param() param: CategoryIdParamDto) {
    const data = await this.userService.findSubs(param);
    return { Message: 'Success', data };
  }
}
