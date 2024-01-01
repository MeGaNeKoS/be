// auth.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { getModelToken } from "@m8a/nestjs-typegoose";

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should call JwtService.sign with correct parameters', async () => {
      const createUserDto: CreateUserDto = { email: 'test@test.com', username: 'test', password: 'test1234' };
      await service.register(createUserDto);
      expect(jwtService.sign).toHaveBeenCalledWith({ email: createUserDto.email, username: createUserDto.username, sub: expect.any(String) });
    });
  });

  describe('login', () => {
    it('should call JwtService.sign with correct parameters', async () => {
      const loginUserDto: LoginUserDto = { username: 'test', password: 'test1234' };
      await service.login(loginUserDto);
      expect(jwtService.sign).toHaveBeenCalledWith({ email: loginUserDto.email, username: loginUserDto.username, sub: expect.any(String) });
    });
  });

  describe('refreshToken', () => {
    it('should call JwtService.sign with correct parameters', async () => {
      const user: any = { email: 'test@test.com', username: 'test', id: 'testid' };
      const refreshTokenDto: RefreshTokenDto = { refreshToken: 'testtoken' };
      await service.refreshToken(user, refreshTokenDto.refreshToken);
      expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email, username: user.username, sub: user.id });
    });
  });

  describe('requestPasswordReset', () => {
    it('should call userModel.findOne with correct parameters', async () => {
      const email = 'test@test.com';
      await service.requestPasswordReset(email);
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
    });
  });

  describe('resetPassword', () => {
    it('should call userModel.findOne with correct parameters', async () => {
      const resetPasswordDto: ResetPasswordDto = { token: 'testtoken', newPassword: 'newpassword1234' };
      await service.resetPassword(resetPasswordDto);
      expect(userModel.findOne).toHaveBeenCalledWith({ passwordResetToken: resetPasswordDto.token });
    });
  });

  describe('signOut', () => {
    it('should call userModel.removeToken with correct parameters', async () => {
      const user: any = { email: 'test@test.com', username: 'test', id: 'testid', removeToken: jest.fn() };
      const token = 'testtoken';
      await service.signOut(user, token);
      expect(user.removeToken).toHaveBeenCalledWith(token);
    });
  });
});
