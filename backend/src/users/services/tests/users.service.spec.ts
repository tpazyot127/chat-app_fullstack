import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from '../users.service';
import { User, UserDocument } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            insertMany: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            find: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user: any = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };
      const createdUser: any = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(userModel, 'create').mockResolvedValueOnce(createdUser);
      const result = await service.create(user);

      expect(result).toEqual(createdUser);
      expect(userModel.create).toHaveBeenCalledWith(user);
    });
  });

  describe('findOne', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const user: any = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user);
      const result = await service.findOne(email);

      expect(result).toEqual(user);
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
    });
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {
      const user: any = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user);
    });

    it('should throw an error if the ID is invalid', async () => {
      const id = 'invalid-id';

      await expect(service.findById(id)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the user is not found', async () => {
      const id = '123';

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);
      await expect(service.findById(id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const id = '123';
      const attrs: Partial<UserDocument> = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword',
      };
      const user: any = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };
      const existingUser: any = {
        _id: '456',
        name: 'Existing User',
        email: 'updated@example.com',
        password: 'password',
      };
      const updatedUser: any = {
        _id: '123',
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'encryptedpassword',
      };

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(existingUser);
    });

    it('should throw an error if the ID is invalid', async () => {
      const id = 'invalid-id';
      const attrs: Partial<UserDocument> = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword',
      };

      await expect(service.update(id, attrs)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the user is not found', async () => {
      const id = '123';
      const attrs: Partial<UserDocument> = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword',
      };

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);
      await expect(service.update(id, attrs)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the email is already in use', async () => {
      const id = '123';
      const attrs: Partial<UserDocument> = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword',
      };
      const user: any = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };
      const existingUser: any = {
        _id: '456',
        name: 'Existing User',
        email: 'updated@example.com',
        password: 'password',
      };

      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(existingUser);
      await expect(service.update(id, attrs)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteMany', () => {
    it('should delete all users', async () => {
      await service.deleteMany();

      expect(userModel.deleteMany).toHaveBeenCalled();
    });
  });
});