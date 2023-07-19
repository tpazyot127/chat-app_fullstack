import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Session,
  Put,
  Param,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { RateLimit } from 'nestjs-rate-limiter'

@Controller('gpt')
export class ChatController {
  constructor(private readonly ChatService: ChatService) {}

  @Get('/question/:chatId')
  async getChat(@Param('chatId') chatId: string) {
    const chat = await this.ChatService.findChat(chatId);
    return chat;
  }

  @Put('/chats/:chatId')
  async saveChat(
    @Param('chatId') chatId: string,
    @Body() payload: { context: string, email: string },
  ) {
    const chat = await this.ChatService.saveChat(payload.context, chatId, payload.email);
    return chat;
  }

  @RateLimit({ keyPrefix: 'chat', points: 5, duration: 10, errorMessage: 'User cannot ask more than five question in 10 seconds' })
  @Post('/chat')
  async createChat(
    @Body() question: string,
  ) {
    const chat = await this.ChatService.createChat(question);
    return chat;
  }
}
