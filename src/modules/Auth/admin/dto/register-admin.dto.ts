import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

export class RegisterAdminDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Moustafa Shousha',
    required: true,
    description: 'Name',
    type: 'string',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'GitGud69',
    required: true,
    description: 'Username',
    type: 'string',
  })
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'moustafa.ahmed760@gmail.com',
    required: true,
    description: 'Email',
    type: 'string',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  @ApiProperty({
    example: 'Ps4dragon4*',
    required: true,
    description: 'Password',
    type: 'string',
  })
  password: string;
}
