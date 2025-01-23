import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CategoryIdParamDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Category ID',
    example: 8,
    required: true,
    type: Number,
  })
  id: number;
}
