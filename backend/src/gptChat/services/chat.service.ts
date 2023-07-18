import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Chat, ChatDocument } from '../schemas/chat.schema';
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai';
import { UserDocument } from 'src/users/schemas/user.schema';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat') private readonly ChatModel: Model<Chat>, 
    @Inject('RateLimiterMemory') private readonly rateLimiter: RateLimiterMemory,
    ) {}

  async findChat(chatId: string): Promise<ChatDocument> {
    await this.rateLimiter.consume(chatId);

    if (!Types.ObjectId.isValid(chatId)){
      throw new BadRequestException('Invalid chat ID.');
    }

    return await this.ChatModel.findById(chatId);
  }

  async saveChat(
    chat: any,
    chatId: string,
    user: UserDocument,
  ): Promise<ChatDocument> {
    await this.rateLimiter.consume(chatId);

    if (!Types.ObjectId.isValid(chatId)){
      throw new BadRequestException('Invalid chat ID.');
    }

    const userMessage = await this.ChatModel.findById(chatId);

    if (!userMessage) {
      const newChat = new this.ChatModel({
        chat: JSON.stringify(chat), // convert chat object to string
        username: user.email,
        _id: chatId, //chatId is userId
      });
      const savedChat = await newChat.save();

      return savedChat;
    } else {
      userMessage.chat = JSON.stringify(chat); // convert chat object to string
      userMessage.username = user.email;
      userMessage._id = chatId;

      const updatedOrder = await userMessage.save();

      return updatedOrder;
    }
  }

  async getChatById(id: string): Promise<ChatDocument> {
    return await this.ChatModel.findById(id).exec();
  }

  async createChat(chat: any, chatId: string, user: UserDocument) {
    await this.rateLimiter.consume(chatId);

    let newQuestion: {
      messages: ConcatArray<{ role: 'system'; content: string }>;
    };
    try {
      newQuestion = JSON.parse(chat.context);
    } catch (error) {
      throw new BadRequestException('Invalid question format');
    }
    const configuration = new Configuration({
      organization: process.env.OPENAI_ORGANIZATION,
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: 'You are a helpful assistant.',
        },
      ].concat(newQuestion.messages),
      temperature: 0,
    });
    const userMessage = await this.ChatModel.findById(chatId);

    if (!userMessage) {
      const newChat = new this.ChatModel({
        chat: JSON.stringify(chat), // convert chat object to string
        username: user.email,
        _id: chatId, //chatId is userId
      });
      await newChat.save();
    }
    const result = new this.ChatModel(completion.data.choices[0].message);

    return result;
  }
}
