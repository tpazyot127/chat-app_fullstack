import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './schemas/chat.schema';
import { ChatController } from './controller/chat.controller';
import { ChatService } from './services/chat.service';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }])],
  providers: [
    ChatService,
    {
      provide: 'RateLimiterMemory',
      useValue: new RateLimiterMemory({
        points: 10, // Number of points
        duration: 1, // Per second
      }),
    },
  ],
  controllers: [ChatController],
})
export class ChatModule {}
