import { IsBoolean, IsOptional, IsString, IsArray } from 'class-validator';

export class SendMessageDto {
  @IsString()
  message: string;

  @IsArray()
  @IsOptional()
  history?: any[];

  @IsBoolean()
  @IsOptional()
  stream?: boolean;
}
