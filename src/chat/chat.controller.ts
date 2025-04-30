import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators';
import { SendMessageDto } from './dto';
import { MESSAGE_SOURCES } from './constants/message-sources';

@Controller('chat')
export class ChatController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get('last-messages')
  @UseGuards(AuthGuard)
  getLastMessages(@User() currentUser) {
    return this.client
      .send('ai-messaging.get-last-messages', {
        companyId: currentUser.companyId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get(':chatId')
  @UseGuards(AuthGuard)
  getChat(@User() currentUser, @Param('chatId') chatId: string) {
    return this.client
      .send('ai-messaging.get-chat', {
        companyId: currentUser.companyId,
        chatId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  // This endpoint will be hit by Meta to send message, we will need to create a service to parse request to what we expect
  // Assuming a happy path.
  @Post()
  @UseGuards(AuthGuard)
  sendMessage(
    @User() currentUser,
    @Body() { fromPhoneNumber, toPhoneNumber, content }: SendMessageDto,
  ) {
    return this.client
      .send('ai-messaging.send-message', {
        fromPhoneNumber: fromPhoneNumber,
        toPhoneNumber,
        companyId: currentUser.companyId,
        content,
        source: MESSAGE_SOURCES.META,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
