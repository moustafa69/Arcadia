import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Moustafa Shousha',
    required: true,
    description: 'Name',
    type: String,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'GitGud69',
    required: true,
    description: 'Username',
    type: String,
  })
  username: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'moustafa.ahmed7099@gmail.com',
    required: true,
    description: 'email',
    type: String,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Ps4dragon4*',
    required: true,
    description: 'Password',
    type: String,
  })
  password: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'www.picture.com',
    required: true,
    description: 'picture',
    type: String,
  })
  picture?: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    example: '2001-04-02',
    required: true,
    description: 'Date of Birth',
    type: Date,
  })
  dob?: Date;
}
