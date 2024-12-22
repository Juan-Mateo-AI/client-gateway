import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CompanyPreferencesDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt?: Date;
}
