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
import { Controller, Inject } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, EventPattern, Payload, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { SendMessageDto } from './dto';

@WebSocketGateway({
  cors: {
    origin: '*', // Change this to restrict allowed origins
  },
})
@Controller('chat-gateway')
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

  @SubscribeMessage('joinCompany')
  handleJoinCompany(@MessageBody() companyId: string, @ConnectedSocket() client: Socket) {
    client.join(`room_${companyId}`);
    console.log(`User joined room: room_${companyId}`);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
    client.join(`chat_${chatId}`);
    console.log(`User joined chat: chat_${chatId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    { chatId, fromPhoneNumber, toPhoneNumber, companyId, content }: SendMessageDto,
  ) {
    try {
      const message = await firstValueFrom(
        this.client
          .send('ai-messaging.messaging.send-message', {
            chatId,
            fromPhoneNumber,
            toPhoneNumber,
            companyId,
            content,
          })
          .pipe(
            catchError((error) => {
              throw new RpcException(error);
            }),
          ),
      );

      this.server.to(`room_${message.companyId}`).emit('newMessage', message);

      this.server.to(`chat_${message.chatId}`).emit('newMessage', message);

      return message;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @EventPattern('message_received')
  handleIncomingMessage(
    @Payload()
    message: {
      chatId: string;
      companyId: string;
      senderPhoneNumber: string;
      content: string;
    },
  ) {
    this.server.to(`room_${message.companyId}`).emit('newMessage', message);
    this.server.to(`chat_${message.chatId}`).emit('newMessage', message);
  }
}
