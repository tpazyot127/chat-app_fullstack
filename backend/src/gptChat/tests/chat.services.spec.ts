import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from '../services/chat.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserDocument } from '../../users/schemas/user.schema';
import { BadRequestException } from '@nestjs/common';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { RateLimiterMemory } from 'rate-limiter-flexible';

describe('ChatService', () => {
  let service: ChatService;
  let chatModel: any;

  beforeEach(async () => {
    chatModel = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: 'RateLimiterMemory',
          useValue: new RateLimiterMemory({
            points: 10, // Number of points
            duration: 1, // Per second
          }),
        },
        {
          provide: getModelToken('Chat'),
          useValue: chatModel,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  describe('findChat', () => {
    it('should return a chat object', async () => {
      const chatId = '649870fbf88fe12756ef7a90';
      const chat = { id: chatId, question: 'Test question' };
      chatModel.findById.mockResolvedValue(chat);

      const result = await service.findChat(chatId);

      expect(result).toEqual(chat);
      expect(chatModel.findById).toHaveBeenCalledWith(chatId);
    });
  });

  describe('saveChat', () => {
    it('should save a chat object', async () => {
      const chatId = '649870fbf88fe12756ef7a90';
      const user = { email: 'test@example.com' } as UserDocument;
      const chat = { id: chatId, question: 'Test question' };
      const savedChat = { ...chat, username: user.email };
      chatModel.findById.mockResolvedValue(null);
      chatModel.save.mockResolvedValue(savedChat);

      const result = await service.saveChat(chat, chatId, user);

      expect(result).toEqual(savedChat);
      expect(chatModel.findById).toHaveBeenCalledWith(chatId);
    });

    it('should update an existing chat object', async () => {
      const chatId = '649870fbf88fe12756ef7a90';
      const user = { email: 'test@example.com' } as UserDocument;
      const chat = { id: chatId, question: 'Test question' };
      const updatedChat = { ...chat, username: user.email };
      chatModel.findById.mockResolvedValue(updatedChat);
      chatModel.save.mockResolvedValue(updatedChat);

      const result = await service.saveChat(chat, chatId, user);

      expect(result).toEqual(updatedChat);
      expect(chatModel.findById).toHaveBeenCalledWith(chatId);
    });

    it('should throw a BadRequestException for invalid chat ID', async () => {
      const chatId = 'invalid-id';
      const user = { email: 'test@example.com' } as UserDocument;
      const chat = { id: chatId, question: 'Test question' };
      chatModel.findById.mockResolvedValue(null);

      await expect(service.saveChat(chat, chatId, user)).rejects.toThrow(BadRequestException);
      expect(chatModel.save).not.toHaveBeenCalled();
    });
  });

  describe('createChat', () => {
    it('should create a chat object', async () => {
      const chatId = '649870fbf88fe12756ef7a90';
      const user = { email: 'test@example.com' } as UserDocument;
      const chat = { context: '{"messages":[{"role":"system","content":"Hello!"}]}' };
      const completion = {
        data: {
          choices: [{ message: 'Hi there!' }],
        },
      };
      chatModel.findById.mockResolvedValue(null);
      const openai = {
        createChatCompletion: jest.fn().mockResolvedValue(completion),
      };
      const configuration = {
        organization: process.env.OPENAI_ORGANIZATION,
        apiKey: process.env.OPENAI_API_KEY,
      };
      const configurationConstructor = jest.fn().mockReturnValue(configuration);
      const openaiConstructor = jest.fn().mockReturnValue(openai);

      const result = await service.createChat(chat, chatId, user);

      expect(result).toEqual(completion.data.choices[0].message);
      expect(chatModel.findById).toHaveBeenCalledWith(chatId);
      expect(openaiConstructor).toHaveBeenCalledWith(configuration);
      expect(configurationConstructor).toHaveBeenCalledWith({
        organization: process.env.OPENAI_ORGANIZATION,
        apiKey: process.env.OPENAI_API_KEY,
      });
      expect(openai.createChatCompletion).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: ChatCompletionRequestMessageRoleEnum.System,
            content: 'You are a helpful assistant.',
          },
          {
            role: 'system',
            content: 'Hello!',
          },
        ],
        temperature: 0,
      });
      expect(chatModel.save).toHaveBeenCalledWith({
        chat: completion.data.choices[0].message,
        username: user.email,
        _id: chatId,
      });
    });

    it('should throw a BadRequestException for invalid question format', async () => {
      const chatId = '649870fbf88fe12756ef7a90';
      const user = { email: 'test@example.com' } as UserDocument;
      const chat = { context: 'invalid-json' };
      chatModel.findById.mockResolvedValue(null);

      await expect(service.createChat(chat, chatId, user)).rejects.toThrow(BadRequestException);
      expect(chatModel.save).not.toHaveBeenCalled();
    });
  });
});