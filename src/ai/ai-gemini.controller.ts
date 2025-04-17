import { Body, Controller, Get, Inject, Param, Patch, UseGuards, Res, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError, map } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AIAuthGuard } from './guards/auth.guard';
import { User } from 'src/account/decorators';
import { request, Response } from 'express';
import { SendMessageDto, AIAuthorizeDto, MessageResponseDto } from './dto';

@Controller('ai/gemini_ai')
export class AIGeminiController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get('authorize/:referenceId')
  async authorize(@Param('referenceId') referenceId: string): Promise<AIAuthorizeDto> {
    try {
      const response = await firstValueFrom(
        this.client
          .send('gemini_ai.authorize', {
            reference_id: referenceId,
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

              // Return the response directly
              return response;
            }),
          ),
      );

      return response.data as AIAuthorizeDto;
    } catch (error) {
      throw error;
    }
  }

  @Post('chat/message')
  @UseGuards(AIAuthGuard)
  async sendMessage(
    @User() currentUser,
    @Body() sendMessageDto: SendMessageDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<MessageResponseDto | any> {
    return firstValueFrom(
      this.client
        .send('gemini_ai.chat.message', {
          companyId: currentUser.companyId,
          message: sendMessageDto.message,
          history: sendMessageDto.history,
          token: request.headers.authorization?.split(' ')[1]
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
