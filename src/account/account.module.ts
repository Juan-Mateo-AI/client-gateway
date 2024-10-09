import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [AccountController],
  imports: [NatsModule],
})
export class AccountModule {}
