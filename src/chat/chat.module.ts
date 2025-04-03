import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { NatsModule } from 'src/transports/nats.module';
import { ChatController } from './chat.controller';

@Module({
  providers: [ChatGateway],
  imports: [NatsModule],
  controllers: [ChatController],
})
export class ChatModule {}
