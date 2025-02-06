import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class InviteUserDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @IsEmail()
  @IsDefined()
  email?: string;
}
