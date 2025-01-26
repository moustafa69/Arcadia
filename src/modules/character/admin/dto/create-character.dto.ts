import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Archetype } from '@prisma/client';

export class CreateCharacterDto {
  @ApiProperty({
    description: 'The name of the character.',
    example: 'Sol Badguy',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'URL of the character’s splash art.',
    example: 'https://example.com/splash-art.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  splashArt: string;

  @ApiProperty({
    description: 'Tier list ranking of the character.',
    example: 'S',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  tierList: string;

  @ApiProperty({
    description: 'Character availability: Base or DLC.',
    example: 'BASE',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  baseRooster: string = 'BASE';

  @ApiPropertyOptional({
    description: 'Optional description of the character.',
    example: 'Sol Badguy is a versatile character with high damage potential.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Character archetype.',
    example: 'Rushdown',
    enum: Archetype,
  })
  @IsEnum(Archetype)
  @IsNotEmpty()
  archetype: Archetype;

  @ApiProperty({
    description: 'URL of the character’s showcase video.',
    example: 'https://example.com/showcase.mp4',
  })
  @IsUrl()
  @IsNotEmpty()
  showcase: string;

  @ApiProperty({
    description: 'URL of the character’s profile photo.',
    example: 'https://example.com/photo.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  photo: string;

  @ApiProperty({
    description: 'The UUID of the game the character belongs to.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  gameId: string;
}
