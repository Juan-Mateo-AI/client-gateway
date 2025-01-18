import { Module } from '@nestjs/common';
import { NatsModule } from './transports/nats.module';
import { AccountModule } from './account/account.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { AIMessagingModule } from './ai-messaging-mw/ai-messaging-mw.module';

@Module({
  imports: [NatsModule, AccountModule, HealthCheckModule, AIMessagingModule],
})
export class AppModule {}
