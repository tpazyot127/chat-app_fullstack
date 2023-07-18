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
import { AuthGuard } from '../../guards/auth.guard'

@Controller('gpt')
export class ChatController {
  constructor(private readonly ChatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Get('/question')
  async getChat(@Session() session: any) {

    console.log(99999999999999, session);
    
    const chat = await this.ChatService.findChat(session.user._id);
    return chat;
  }

  @UseGuards(AuthGuard)
  @Put('/chats')
  async saveChat(@Body() question: string, @Session() session: any) {
    const chat = await this.ChatService.saveChat(question, session.user._id, session.user);
    return chat;
  }

  @UseGuards(AuthGuard)
  @Post('/chat')
  async createChat(@Body() question: string, @Session() session: any) {
    const chat = await this.ChatService.createChat(question, session.user._id, session.user);
    return chat;
  }
}
