import { IsString } from 'class-validator';

export class AIAuthorizeDto {
  @IsString()
  access_token: string;

  @IsString()
  token_type: string;
}
