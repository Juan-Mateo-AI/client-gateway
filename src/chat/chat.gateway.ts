import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { SendMessageDto } from './dto';
import { MESSAGE_SOURCES } from './constants/message-sources';
import { WsAuthGuard } from './guards/ws-auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinCompany')
  handleJoinCompany(@MessageBody() companyId: string, @ConnectedSocket() client: Socket) {
    if (client.data.user.companyId !== companyId) {
      throw new UnauthorizedException('No authorized to join this company');
    }

    client.join(`room_${companyId}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    { chatId, fromPhoneNumber, toPhoneNumber, companyId, content }: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (client.data.user.companyId !== companyId) {
      throw new UnauthorizedException('No authorized to send messages to this company');
    }

    try {
      const message = await firstValueFrom(
        this.client
          .send('ai-messaging.send-message', {
            chatId,
            fromPhoneNumber,
            toPhoneNumber,
            companyId,
            content,
            source: MESSAGE_SOURCES.CLIENT,
          })
          .pipe(
            catchError((error) => {
              throw new RpcException(error);
            }),
          ),
      );

      this.server.to(`room_${message?.messageReceived?.companyId}`).emit('newMessage', message);

      return message;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  notifyAll(message) {
    this.server.to(`room_${message?.messageReceived?.companyId}`).emit('newMessage', message);
  }
}
