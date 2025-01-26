import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class GalleryDto {
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
}
