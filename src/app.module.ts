import { Module } from '@nestjs/common';
import { NatsModule } from './transports/nats.module';
import { AccountModule } from './account/account.module';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [NatsModule, AccountModule, HealthCheckModule],
})
export class AppModule {}
