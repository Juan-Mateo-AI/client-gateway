import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  providers: [ChatGateway],
  imports: [NatsModule],
})
export class ChatModule {}
