import { Body, Controller, Get, Inject, Param, Patch, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AIAuthGuard } from './guards/ai-auth.guard';
import { SendMessageDto, AIAuthorizeDto, MessageResponseDto } from './dto';
import { AIToken } from './decorators/ai-token.decorator';

@Controller('ai/open_ai')
export class AIOpenAIController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get('authorize/:referenceId')
  async authorize(@Param('referenceId') referenceId: string): Promise<AIAuthorizeDto> {
    try {
      const response = await firstValueFrom(
        this.client
          .send('open_ai.authorize', {
            referenceId,
          })
          .pipe(
            catchError((error) => {
              throw new RpcException(error);
            }),
            map((response) => {
              // Check if response has an error field
              if (response && response.error) {
                throw new RpcException({
                  status: response.status || 500,
                  data: { error: response.error },
                });
              }
              return response.data as AIAuthorizeDto;
            }),
          ),
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Patch('chat/message')
  @UseGuards(AIAuthGuard)
  async sendMessage(
    @AIToken() token: string,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<MessageResponseDto | any> {
    return firstValueFrom(
      this.client
        .send('open_ai.chat.message', {
          token: token,
          message: sendMessageDto.message,
          history: sendMessageDto.history,
        })
        .pipe(
          catchError((error) => {
            throw new RpcException(error);
          }),
          map((response) => {
            // Check if response has an error field
            if (response && response.error) {
              throw new RpcException({
                status: response.status || 500,
                data: { error: response.error },
              });
            }

            // Return the response as MessageResponseDto
            return response.data as MessageResponseDto;
          }),
        ),
    );
  }
}
