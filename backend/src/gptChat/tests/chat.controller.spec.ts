import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from '../controller/chat.controller';
import { ChatService } from '../services/chat.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RateLimiterMemory } from 'rate-limiter-flexible';

describe('ChatController', () => {
  let controller: ChatController;
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
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
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);
  });

  describe('getChat', () => {
    it('should return a chat object', async () => {
      const session = { user: { _id: '123' } };
      const chat: any = {
        _id: '456',
        chat: [],
        role: 'user',
        content: 'Test question',
        username: 'testuser',
      };
      jest.spyOn(service, 'findChat').mockResolvedValue(chat);

      const result = await controller.getChat(session);

      expect(result).toEqual(chat);
      expect(service.findChat).toHaveBeenCalledWith(session.user._id);
    });
  });

  describe('saveChat', () => {
    it('should save a chat object', async () => {
      const session = { user: { _id: '123' } };
      const question = 'Test question';
      const chat: any = {
        _id: '456',
        chat: [],
        role: 'user',
        content: question,
        username: 'testuser',
      };
      jest.spyOn(service, 'saveChat').mockResolvedValue(chat);

      const result = await controller.saveChat(question, session);

      expect(result).toEqual(chat);
      expect(service.saveChat).toHaveBeenCalledWith(
        question,
        session.user._id,
        session.user,
      );
    });
  });

  describe('createChat', () => {
    it('should create a chat object', async () => {
      const session = { user: { _id: '123' } };
      const question = 'Test question';
      const chat: any = {
        _id: '456',
        chat: [],
        role: 'user',
        content: question,
        username: 'testuser',
      };
      jest.spyOn(service, 'createChat').mockResolvedValue(chat);

      const result = await controller.createChat(question, session);

      expect(result).toEqual(chat);
      expect(service.createChat).toHaveBeenCalledWith(
        question,
        session.user._id,
        session.user,
      );
    });
  });
});
