import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../../services/users.service';
import { UserDto } from '../../dtos/user.dto';
import { AdminProfileDto } from '../../dtos/admin.profile.dto';
import { AdminGuard } from '../../../guards/admin.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            adminUpdate: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AdminGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const user: any = {
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
      };
      const id = '123';

      jest.spyOn(usersService, 'findById').mockResolvedValueOnce(user);
      const result = await controller.getUser(id);

      expect(result).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('should update a user by ID', async () => {
      const credentials: AdminProfileDto = {
        name: 'Updated User',
        email: 'updated@example.com',
        isAdmin: true,
      };
      const user: any = {
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
      };
      const id = '123';

      jest.spyOn(usersService, 'adminUpdate').mockResolvedValueOnce(user);
      const result = await controller.updateUser(id, credentials);

      expect(result).toEqual(user);
      expect(usersService.adminUpdate).toHaveBeenCalledWith(id, credentials);
    });
  });
});