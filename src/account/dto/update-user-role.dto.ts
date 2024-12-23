import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateUserRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsUUID()
  @IsOptional()
  companyId?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt?: Date;
}
