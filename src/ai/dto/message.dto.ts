import { IsDefined, IsOptional, IsString, IsBoolean, IsArray } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsDefined()
  message: string;

  @IsString()
  @IsOptional()
  role: string = 'user';

  @IsArray()
  @IsOptional()
  history: any[] = [];

  @IsBoolean()
  @IsDefined()
  stream: boolean;
}
