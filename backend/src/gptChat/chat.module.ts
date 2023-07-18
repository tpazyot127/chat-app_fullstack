import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './schemas/chat.schema';
import { ChatController } from './controller/chat.controller';
import { ChatService } from './services/chat.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
