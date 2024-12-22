import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CompanyPreferencesDto } from './company-preferences.dto';

export class CompanyDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsDefined()
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  @IsDefined()
  email: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt?: Date;

  @ValidateNested()
  @Type(() => CompanyPreferencesDto)
  preferences: CompanyPreferencesDto;
}
