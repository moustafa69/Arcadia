import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyUserAccountDto {
  @IsNumber()
  @ApiProperty({
    example: '123456',
    required: true,
    description: 'code',
    type: 'number',
  })
  code: number;

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
