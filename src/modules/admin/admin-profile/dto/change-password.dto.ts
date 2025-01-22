import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class ChangePasswordAdminDto {
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  @ApiProperty({
    example: '*******',
    required: true,
    description: 'password',
    type: String,
  })
  oldPassword: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  @ApiProperty({
    example: '*******',
    required: true,
    description: 'password',
    type: String,
  })
  newPassword: string;
}
