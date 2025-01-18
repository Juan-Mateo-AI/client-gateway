import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';

@Controller('ai-messaging')
export class AIMessagingController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}
}
