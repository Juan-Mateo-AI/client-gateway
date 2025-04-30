import { Injectable } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private readonly chatGateway: ChatGateway) {}

  async notifyAll(message: MessageDto) {
    this.chatGateway.notifyAll(message);
  }
}
