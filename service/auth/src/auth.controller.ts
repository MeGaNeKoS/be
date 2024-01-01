import { Body, Controller, HttpCode, Post, Req, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtAuthGuard } from "@shared/guard/jwt-auth.guard";
import { User } from "@shared/model/user.model";
import { DocumentType } from "@typegoose/typegoose";
import { RefreshTokenDto } from "@auth/dto/refresh-token.dto";
import { Request } from "express";


@Controller("api")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post("request-password-reset")
  async requestPasswordReset(@Body("email") email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @SetMetadata("ignoreExpiration", true)
  @Post("refresh-token")
  async refreshToken(@Req() req: Request & { user: DocumentType<User> }, @Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshToken(req.user, refreshToken.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post("sign-out")
  @HttpCode(205)
  async signOut(@Req() req: Request & { user:  DocumentType<User> }) {
    const token = req.headers.authorization.split(" ")[1];
    await this.authService.signOut(req.user, token)
    return;
  }
}
