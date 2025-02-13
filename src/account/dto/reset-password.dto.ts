import { IsDefined, IsEmail, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @IsDefined()
  @IsUUID()
  token: string;

  @IsDefined()
  @IsString()
  @IsStrongPassword()
  password: string;
}
