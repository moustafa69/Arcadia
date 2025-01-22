import { IsNotEmpty, IsString } from 'class-validator';

export class AdminIdParamDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
