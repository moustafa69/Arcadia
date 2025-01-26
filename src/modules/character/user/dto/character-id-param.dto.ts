import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CharacterIdParamDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Character ID',
    example: '47d3d3fb-ff29-4696-84ec-a42e62fba64e',
    required: true,
    type: String,
  })
  id: string;
}
