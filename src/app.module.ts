import { Module } from '@nestjs/common';
import { NatsModule } from './transports/nats.module';
import { AccountModule } from './account/account.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { ChatModule } from './chat/chat.module';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [NatsModule, AccountModule, HealthCheckModule, ChatModule, AIModule],
})
export class AppModule {}
