import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { BasePaginationDto } from 'src/common/utils/pagination';

export class ListAllAdminsQueryDto extends BasePaginationDto {
  @ApiProperty({
    description: 'Search by Role',
    example: 'SUPER_ADMIN',
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
