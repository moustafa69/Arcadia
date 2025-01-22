import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SuspendUserDto {
  @ApiProperty({
    description: 'reason for suspension',
    example: 'due to violation of terms',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
