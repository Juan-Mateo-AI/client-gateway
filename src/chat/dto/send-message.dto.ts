import { IsDefined, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  @IsOptional()
  chatId?: string;

  @IsString()
  @IsDefined()
  fromPhoneNumber: string;

  @IsString()
  @IsDefined()
  toPhoneNumber: string;

  @IsUUID()
  @IsOptional()
  companyId: string;

  @IsString()
  @IsDefined()
  content: string;
}
