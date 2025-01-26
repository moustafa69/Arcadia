import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGuideDto {
  @ApiProperty({
    description: 'The title of the guide',
    example: 'Beginner Guide to Street Fighter',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'An array of image URLs for the gallery',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  gallery: string[];

  @ApiPropertyOptional({
    description: 'The URL of the guide',
    example: 'https://example.com/guide',
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({
    description: 'Additional information about the guide',
    example: 'This guide is for beginners who are new to the game.',
  })
  @IsOptional()
  @IsString()
  info?: string;

  @ApiPropertyOptional({
    description: 'The name of the authentic author',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  authenticAuthor?: string;

  @ApiPropertyOptional({
    description: 'The ID of the related game',
    example: '47d3d3fb-ff29-4696-84ec-a42e62fba64e',
  })
  @IsOptional()
  @IsString()
  gameId?: string;
}
