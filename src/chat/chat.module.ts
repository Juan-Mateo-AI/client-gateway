import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { NatsModule } from 'src/transports/nats.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [NatsModule],
  controllers: [ChatController],
})
export class ChatModule {}
