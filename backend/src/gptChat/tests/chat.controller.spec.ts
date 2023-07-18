import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from '../controller/chat.controller';
import { ChatService } from '../services/chat.service';
import { AuthGuard } from '../../guards/auth.guard';

describe('ChatController', () => {
  let controller: ChatController;
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [ChatService],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);
  });

  describe('getChat', () => {
    it('should return a chat object', async () => {
      const id = '123';
      const question = 'Test question';
      const chat: any = {
        _id: '456',
        chat: [],
        role: 'user',
        content: question,
        username: 'testuser',
      };
      jest.spyOn(service, 'findChat').mockResolvedValue(chat);

      const result = await controller.getChat(id);

      expect(result).toEqual(chat);
      expect(service.findChat).toHaveBeenCalledWith(id);
    });
  });

  describe('saveChat', () => {
    it('should save a chat object', async () => {
      const id = '123';
      const question = 'Test question';
      const email = 'example@gmail.com'
      const chat: any = {
        _id: '456',
        chat: [],
        role: 'user',
        content: question,
        username: 'testuser',
      };
      jest.spyOn(service, 'saveChat').mockResolvedValue(chat);

      const result = await controller.createChat(question );

      expect(result).toEqual(chat);
      expect(service.saveChat).toHaveBeenCalledWith(
        question,
        id,
        email,
      );
    });
  });

  describe('createChat', () => {
    it('should create a chat object', async () => {
      const id = '123';
      const question = 'Test question';
      const email = 'example@gmail.com'
      const chat: any = {
        _id: '456',
        chat: [],
        role: 'user',
        content: question,
        username: 'testuser',
      };
      jest.spyOn(service, 'createChat').mockResolvedValue(chat);

      const result = await controller.createChat(question );

      expect(result).toEqual(chat);
      expect(service.createChat).toHaveBeenCalledWith(
        question,
        id,
        email,
      );
    });
  });
});
