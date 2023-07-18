import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Chat, ChatDocument } from '../schemas/chat.schema';
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai';

@Injectable()
export class ChatService {
  constructor(@InjectModel('Chat') private readonly ChatModel: Model<Chat>) {}

  async findChat(chatId: string): Promise<ChatDocument> {
    if (!Types.ObjectId.isValid(chatId)) {
      throw new BadRequestException('Invalid chat ID.');
    }

    return await this.ChatModel.findById(chatId);
  }

  async saveChat(
    chat: any,
    chatId: string,
    userEmail: string,
  ): Promise<ChatDocument> {
    if (!Types.ObjectId.isValid(chatId)) {
      throw new BadRequestException('Invalid chat ID.');
    }
    
    const userMessage = await this.ChatModel.findById(chatId);

    if (!userMessage) {
      const newChat = new this.ChatModel({
        chat: JSON.stringify(chat), // convert chat object to string
        username: userEmail,
        _id: chatId, //chatId is userId
      });
      const savedChat = await newChat.save();

      return savedChat;
    } else {
      userMessage.chat = JSON.stringify(chat); // convert chat object to string
      userMessage.username = userEmail;
      userMessage._id = chatId;

      const updatedOrder = await userMessage.save();

      return updatedOrder;
    }
  }

  async getChatById(id: string): Promise<ChatDocument> {
    return await this.ChatModel.findById(id).exec();
  }

  async createChat(chat: any) {
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
    
    const result = new this.ChatModel(completion.data.choices[0].message);

    return result;
  }
}
