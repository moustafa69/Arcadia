import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export function addPaginationParams({
  limit,
  page,
}: {
  page: number;
  limit: number;
}): { skip: number; take: number } {
  const skip = (page - 1) * limit;
  return {
    skip,
    take: limit,
  };
}

export class BasePaginationDto {
  @ApiProperty({
    description: 'limit',
    example: '10',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    {},
    {
      message: 'limit must be a number conforming to the specified constraints',
    },
  )
  @Min(1, { message: 'limit must be at least 1' })
  limit: number;

  @ApiProperty({
    description: 'Page',
    example: '1',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    {},
    {
      message: 'page must be a number conforming to the specified constraints',
    },
  )
  @Min(1, { message: 'page must be at least 1' })
  page: number;
}
