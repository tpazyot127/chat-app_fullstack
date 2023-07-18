import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { encryptPassword } from '../../../utils';

jest.mock('../users.service');
jest.mock('@nestjs/jwt');
jest.mock('bcryptjs');
jest.mock('../../../utils/index');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('validateUser', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const email = 'test@example.com';
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(undefined);

      await expect(authService.validateUser(email, 'password')).rejects.toThrow(
        NotFoundException,
      );
      expect(usersService.findOne).toHaveBeenCalledWith(email);
    });

    it('should throw BadRequestException if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user: any = { email, password: 'hashedPassword' };
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
      await expect(authService.validateUser(email, password)).rejects.toThrow(
        BadRequestException,
      );
      expect(usersService.findOne).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });

    it('should return user if email and password are valid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user: any = { email, password: 'hashedPassword' };
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      const result = await authService.validateUser(email, password);
      expect(result).toEqual(user);
      expect(usersService.findOne).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const username = 'test';
      const userId = '123';
      const payload = { username, sub: userId };
      const token = 'accessToken';
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(token);

      const result = await authService.login(username, userId);
      expect(result).toEqual({ accessToken: token });
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });
  });

  describe('register', () => {
    it('should throw BadRequestException if email is already in use', async () => {
      const name = 'Test User';
      const email = 'test@example.com';
      const password = 'password';
      const existingUser: any = { email };
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(existingUser);

      await expect(authService.register(name, email, password)).rejects.toThrow(
        BadRequestException,
      );
      expect(usersService.findOne).toHaveBeenCalledWith(email);
    });

    it('should create a new user and return it', async () => {
      const name = 'Test User';
      const email = 'test@example.com';
      const password = 'password';
      const encryptedPassword = 'hashedPassword';
      const user: any = {
        name,
        email,
        password: encryptedPassword,
        isAdmin: false,
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(usersService, 'create').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(encryptedPassword);

      const result = await authService.register(name, email, password);
      expect(result).toEqual(user);
      expect(usersService.findOne).toHaveBeenCalledWith(email);
      expect(encryptPassword).toHaveBeenCalledWith(password);
    });
  });
});
