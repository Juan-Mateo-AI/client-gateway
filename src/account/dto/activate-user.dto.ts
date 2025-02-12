import { IsDefined, IsString, IsStrongPassword } from 'class-validator';

export class ActivateUserDto {
  @IsString()
  @IsStrongPassword()
  @IsDefined()
  password: string;
}
