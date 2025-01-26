import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from 'src/common/utils/pagination';

export class ListGuideQueryDto extends BasePaginationDto {
  @ApiProperty({
    description: 'Search by Author',
    example: 'zeingar',
    required: false,
  })
  @IsString()
  @IsOptional()
  authenticAuthor?: string;

  @ApiProperty({
    description: 'Search by Game Title',
    example: 'Guilty Gear',
    required: false,
  })
  @IsString()
  @IsOptional()
  game?: string;
}
