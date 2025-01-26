import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CharacterIdParamDto } from './dto/character-id-param.dto';
import { ListCharacterQueryDto } from './dto/list-all-characters-query.dto';
import { UserService } from './user.service';
@ApiTags('characters/user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() query: ListCharacterQueryDto) {
    const data = await this.userService.findAll(query);
    return { Message: 'Success', data };
  }

  @Get(':id')
  async findOne(@Param() param: CharacterIdParamDto) {
    const data = await this.userService.findOne(param);
    return { Message: 'Success', data };
  }
}
