import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { BasePaginationDto } from 'src/common/utils/pagination';

export class ListAllUsersQueryDto extends BasePaginationDto {
  @ApiProperty({
    description: 'Search by status',
    example: 'ACTIVE',
    required: false,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
