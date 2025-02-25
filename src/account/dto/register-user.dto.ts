import { IsEmail, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsUUID()
  userRoleId: string;
}
