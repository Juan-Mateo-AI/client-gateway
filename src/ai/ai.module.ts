import { Module } from '@nestjs/common';
import { AIGateway } from './ai.gateway';
import { NatsModule } from 'src/transports/nats.module';
import { AIController } from './ai.controller';
import { AIUserAuthController } from './ai-user-auth.controller';
import { UserAuth, UserAuthSchema } from './schemas/user-auth.schema';

@Module({
  providers: [AIGateway],
  imports: [NatsModule],
  controllers: [AIController, AIUserAuthController],
})
export class AIModule {}
