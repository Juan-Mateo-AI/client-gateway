import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateUserRoleDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsUUID()
  @IsDefined()
  companyId: string;

  @IsBoolean()
  @IsDefined()
  isAdmin: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt?: Date;
}
