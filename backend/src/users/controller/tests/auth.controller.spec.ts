import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { UserDocument } from '../../schemas/user.schema';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a logged in user', async () => {
      const user: any = {
        name: 'Test User',
        _id: '123',
        email: 'test@example.com',
        isAdmin: false,
      };
      const accessToken = 'testAccessToken';
      const session = {
        user: null,
      };

      jest.spyOn(authService, 'login').mockResolvedValueOnce({ accessToken });
      const result = await controller.login(user, session);

      expect(result).toEqual({
        name: user.name,
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        accessToken,
      });
      expect(session.user).toEqual({
        name: user.name,
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        accessToken,
      });
    });
  });

  describe('register', () => {
    it('should return a logged in user', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testPassword',
      };
      const user: any = {
        name: registerDto.name,
        _id: '123',
        email: registerDto.email,
        isAdmin: false,
      };
      const accessToken = 'testAccessToken';
      const session = {
        user: null,
      };

      jest.spyOn(authService, 'register').mockResolvedValueOnce(user);
      jest.spyOn(authService, 'login').mockResolvedValueOnce({ accessToken });
      const result = await controller.register(registerDto, session);

      expect(result).toEqual({
        name: user.name,
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        accessToken,
      });
      expect(session.user).toEqual({
        name: user.name,
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        accessToken,
      });
    });
  });

  describe('updateUser', () => {
    it('should return an updated user', async () => {
      const credentials = {
        name: 'Updated User',
      };
      const user: any = {
        name: 'Test User',
        _id: '123',
        email: 'test@example.com',
        isAdmin: false,
      };
      const updatedUser: UserDocument = {
        ...user,
        name: credentials.name,
      };
      const session = {
        user: {
          ...user,
          accessToken: 'testAccessToken',
        },
      };

      jest.spyOn(usersService, 'update').mockResolvedValueOnce(updatedUser);
      const result = await controller.updateUser(credentials, session);

      expect(result).toEqual({
        name: updatedUser.name,
        _id: updatedUser._id,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        accessToken: session.user.accessToken,
      });
      expect(session.user).toEqual({
        ...updatedUser,
        accessToken: session.user.accessToken,
      });
    });
  });
});