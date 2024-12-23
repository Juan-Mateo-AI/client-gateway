import { Module } from '@nestjs/common';
import { AccountAuthController } from './account-auth.controller';
import { NatsModule } from 'src/transports/nats.module';
import { AccountUserController } from './account-user.controller';
import { AccountCompanyController } from './account-company.controller';
import { AccountUserRolesController } from './account-user-roles.controller';

@Module({
  controllers: [
    AccountAuthController,
    AccountUserController,
    AccountCompanyController,
    AccountUserRolesController,
  ],
  imports: [NatsModule],
})
export class AccountModule {}
