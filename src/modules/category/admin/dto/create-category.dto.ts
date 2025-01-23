import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'The name of the category',
    example: 'Action Games',
  })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({
    description: 'a cool fighting game',
    example: 'Action Games',
  })
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'ID of parent Category if not the root',
    example: '1',
  })
  parentId?: number;
}
