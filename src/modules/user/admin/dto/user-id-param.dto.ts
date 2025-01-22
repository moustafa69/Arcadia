import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserIdParamDto {
  @ApiProperty({
    description: 'User ID',
    example: '8324nkdffnnj1983e20',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
