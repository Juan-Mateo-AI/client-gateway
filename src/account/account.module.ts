import { Module } from '@nestjs/common';
import { AccountAuthController } from './account-auth.controller';
import { NatsModule } from 'src/transports/nats.module';
import { AccountUserController } from './account-user.controller';

@Module({
  controllers: [AccountAuthController, AccountUserController],
  imports: [NatsModule],
})
export class AccountModule {}
