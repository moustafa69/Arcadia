import { ApiProperty } from '@nestjs/swagger';
import { Role, Permissions } from '@prisma/client';
import {
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'The name of the admin',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The unique username of the admin',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The email address of the admin',
    example: 'admin@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'The password for the admin account (must be at least 8 characters long)',
    example: 'StrongPassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: `The role of the admin. Allowed values: ${Object.values(
      Role,
    ).join(', ')}`,
    example: Role.MODERATOR,
    required: false,
  })
  @IsEnum(Role, {
    message: `Role must be one of: ${Object.values(Role).join(', ')}`,
  })
  @IsOptional()
  role?: Role;
}
