import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateUserDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsUUID()
  @IsOptional()
  companyId?: string;

  @IsUUID()
  @IsOptional()
  userRoleId?: string;
}
