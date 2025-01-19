import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordAdminDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'moustafa.ahmed760@gmail.com',
    required: true,
    description: 'email',
    type: 'string',
  })
  email: string;
}
