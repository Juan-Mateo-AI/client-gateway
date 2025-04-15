import { Body, Controller, Get, Inject, Param, Patch, UseGuards, Res } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { AIAuthGuard } from './guards/auth.guard';
import { User } from 'src/account/decorators';
import { Response } from 'express';
import { SendMessageDto, AIAuthorizeDto, MessageResponseDto } from './dto';

@Controller('gemini_ai')
export class AIController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get('authorize/:referenceId')
  async authorize(@Param('referenceId') referenceId: string): Promise<AIAuthorizeDto> {
    return this.client
      .send('gemini_ai.authorize', {
        referenceId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      )
      .toPromise();
  }

  @Patch('chat/message')
  @UseGuards(AIAuthGuard)
  async sendMessage(
    @User() currentUser,
    @Body() sendMessageDto: SendMessageDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<MessageResponseDto | any> {
    if (sendMessageDto.stream) {
      // Handle streaming response
      const stream = await this.client
        .send('gemini_ai.chat.message.stream', {
          companyId: currentUser.companyId,
          message: sendMessageDto.message,
          history: sendMessageDto.history,
        })
        .pipe(
          catchError((error) => {
            throw new RpcException(error);
          }),
        )
        .toPromise();

      response.setHeader('Content-Type', 'text/event-stream');
      return stream;
    } else {
      // Handle non-streaming response
      return this.client
        .send('gemini_ai.chat.message', {
          companyId: currentUser.companyId,
          message: sendMessageDto.message,
          history: sendMessageDto.history,
        })
        .pipe(
          catchError((error) => {
            throw new RpcException(error);
          }),
        )
        .toPromise();
    }
  }
}
