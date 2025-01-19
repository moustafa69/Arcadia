import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class ResetPasswordAdminDto {
  @IsNumber()
  @ApiProperty({
    example: '123456',
    required: true,
    description: 'code',
    type: 'number',
  })
  code: number;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  @ApiProperty({
    example: '*******',
    required: true,
    description: 'password',
    type: 'string',
  })
  newPassword: string;

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
