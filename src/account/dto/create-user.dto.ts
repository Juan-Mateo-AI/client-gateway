import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsUUID()
  @IsOptional()
  companyId?: string;

  @IsUUID()
  @IsOptional()
  userRoleId?: string;
}
