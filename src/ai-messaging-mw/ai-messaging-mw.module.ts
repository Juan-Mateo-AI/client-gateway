import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { AIMessagingUserAuthController } from './ai-messaging-user-auth.controller';

@Module({
  controllers: [AIMessagingUserAuthController],
  imports: [NatsModule],
})
export class AIMessagingModule {}
