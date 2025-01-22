import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from 'src/modules/Auth/user/dto';

export class UpdateUserProfileDto extends PartialType(RegisterUserDto) {}
