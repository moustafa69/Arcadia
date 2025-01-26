import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { BasePaginationDto } from 'src/common/utils/pagination';

export class ListGameQueryDto extends BasePaginationDto {
  @ApiProperty({
    description: 'Search mechanic',
    example: 'IDK',
    required: false,
  })
  @IsString()
  @IsOptional()
  mechanic?: string;

  @ApiProperty({
    description: 'Search platform',
    example: 'PC',
    required: false,
  })
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiProperty({
    description: 'Search store',
    example: 'EPIC',
    required: false,
  })
  @IsString()
  @IsOptional()
  store?: string;

  @ApiProperty({
    description: 'Search net code',
    example: 'RollBack',
    required: false,
  })
  @IsString()
  @IsOptional()
  netCodeType?: string;

  @ApiProperty({
    description: 'Search category',
    example: 'Anime',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;
}
