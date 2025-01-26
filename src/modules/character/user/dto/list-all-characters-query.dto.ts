import { ApiProperty } from '@nestjs/swagger';
import { Archetype } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { BasePaginationDto } from 'src/common/utils/pagination';

export class ListCharacterQueryDto extends BasePaginationDto {
  @ApiProperty({
    description: 'Search by Tier List',
    example: 'S',
    required: false,
  })
  @IsString()
  @IsOptional()
  tierList?: string;

  @ApiProperty({
    description: 'Search by Archetype',
    example: 'RUSHDOWN',
    required: false,
  })
  @IsEnum(Archetype)
  @IsOptional()
  archetype?: string;

  @ApiProperty({
    description: 'Search by game name',
    example: 'Guilty Gear Strive',
    required: false,
  })
  @IsString()
  @IsOptional()
  game?: string;
}
