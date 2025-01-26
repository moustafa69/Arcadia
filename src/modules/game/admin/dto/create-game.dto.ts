import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsPositive,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';

export class CreateGameDto {
  @ApiProperty({
    description: 'The title of the game',
    example: 'Street Fighter VI',
  })
  @IsString()
  @IsNotEmpty({ message: 'The title is required and cannot be empty.' })
  title: string;

  @ApiPropertyOptional({
    description: 'The mechanic or genre of the game',
    example: 'Fighting',
  })
  @IsOptional()
  @IsString()
  mechanic?: string;

  @ApiPropertyOptional({
    description: 'The universal price of the game in USD',
    example: 59.99,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'The price must be a positive number.' })
  universalPrice?: number;

  @ApiProperty({
    description: 'The platforms the game is available on',
    example: ['PC', 'PlayStation', 'Xbox'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true, message: 'Each platform must be a string.' })
  @IsNotEmpty({ each: true, message: 'Platform names cannot be empty.' })
  platform: string[];

  @ApiProperty({
    description: 'The stores where the game is available',
    example: ['Steam', 'EpicGames'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true, message: 'Each store must be a string.' })
  @IsNotEmpty({ each: true, message: 'Store names cannot be empty.' })
  store: string[];

  @ApiProperty({
    description: 'The estimated number of players in the game',
    example: 100000,
  })
  @IsNumber()
  @IsPositive({ message: 'The player base count must be a positive number.' })
  playerBaseCount: number;

  @ApiPropertyOptional({
    description: 'The type of net code used in the game',
    example: 'Rollback',
  })
  @IsOptional()
  @IsString()
  netCodeType?: string;

  @ApiPropertyOptional({
    description: 'The cover photo URL of the game',
    example: 'https://example.com/cover-photo.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'The cover photo must be a valid URL.' })
  coverPhoto?: string;

  @ApiProperty({
    description: 'The ID of the category the game belongs to',
    example: 1,
  })
  @IsNumber()
  @IsPositive({ message: 'The category ID must be a positive number.' })
  categoryId: number;
}
