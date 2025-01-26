import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class GameIdParamDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Game ID',
    example: '47d3d3fb-ff29-4696-84ec-a42e62fba64e',
    required: true,
    type: String,
  })
  id: string;
}
