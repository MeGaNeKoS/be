// auth.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from "@auth/dto/refresh-token.dto";


describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            requestPasswordReset: jest.fn(),
            resetPassword: jest.fn(),
            refreshToken: jest.fn(),
            signOut: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register with correct parameters', async () => {
      const createUserDto: CreateUserDto = { email: 'test@test.com', username: 'test', password: 'test1234' };
      await controller.register(createUserDto);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const loginUserDto: LoginUserDto = { username: 'test', password: 'test1234' };
      await controller.login(loginUserDto);
      expect(service.login).toHaveBeenCalledWith(loginUserDto);
    });
  });

  describe('requestPasswordReset', () => {
    it('should call AuthService.requestPasswordReset with correct parameters', async () => {
      const email = 'test@test.com';
      await controller.requestPasswordReset(email);
      expect(service.requestPasswordReset).toHaveBeenCalledWith(email);
    });
  });

  describe('resetPassword', () => {
    it('should call AuthService.resetPassword with correct parameters', async () => {
      const resetPasswordDto: ResetPasswordDto = { token: 'testtoken', newPassword: 'newpassword1234' };
      await controller.resetPassword(resetPasswordDto);
      expect(service.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
    });
  });

  describe('refreshToken', () => {
    it('should call AuthService.refreshToken with correct parameters', async () => {
      const req: any = { user: { id: 'testid' } };
      const refreshTokenDto: RefreshTokenDto = { refreshToken: 'testtoken' };
      await controller.refreshToken(req, refreshTokenDto);
      expect(service.refreshToken).toHaveBeenCalledWith(req.user, refreshTokenDto.refreshToken);
    });
  });

  describe('signOut', () => {
    it('should call AuthService.signOut with correct parameters', async () => {
      const req: any = { user: { id: 'testid' }, headers: { authorization: 'Bearer testtoken' } };
      await controller.signOut(req);
      expect(service.signOut).toHaveBeenCalledWith(req.user, 'testtoken');
    });
  });
});
