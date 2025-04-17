import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { AIGeminiController } from './ai-gemini.controller';
import { AIUserAuthController } from './ai-user-auth.controller';
import { AIOpenAIController } from './ai-openai.controller';

@Module({
  imports: [NatsModule],
  controllers: [AIGeminiController, AIUserAuthController, AIOpenAIController],
})
export class AIModule {}
