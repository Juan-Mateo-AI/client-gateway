import { Body, Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators';
import { GetLastMessagesDto } from './dto';

@Controller('chat')
export class ChatController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get('last-messages')
  @UseGuards(AuthGuard)
  getLastMessages(@User() currentUser, @Body() getLastMessagesDto: GetLastMessagesDto) {
    return this.client
      .send('ai-messaging.get-last-messages', {
        companyId: currentUser.companyId,
        ...getLastMessagesDto,
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
}
