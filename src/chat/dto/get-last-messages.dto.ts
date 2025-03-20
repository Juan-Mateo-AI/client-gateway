import { IsDefined, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class GetLastMessagesDto {
  @IsUUID()
  @IsDefined()
  companyId: string;

  @IsNumber()
  @IsOptional()
  numOfChats: number;

  @IsNumber()
  @IsOptional()
  numOfMessages: number;
}
