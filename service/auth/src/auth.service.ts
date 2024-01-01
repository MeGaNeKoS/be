import { randomBytes } from "crypto";
import { BadRequestException, GoneException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@shared/model/user.model";
import { CreateUserDto } from "@auth/dto/create-user.dto";
import { LoginUserDto } from "@auth/dto/login-user.dto";
import { ResetPasswordDto } from "@auth/dto/reset-password.dto";
import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "@m8a/nestjs-typegoose";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>) {
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne(
      {$or: [{email: createUserDto.email}, {username: createUserDto.username}]}
    );

    if (user) {
      throw new BadRequestException("User with given email or username already exists");
    }

    const newUser = new this.userModel(createUserDto);
    await newUser.hashPassword();

    const payload = {email: newUser.email, username: newUser.username, sub: newUser._id};
    const jwt = this.jwtService.sign(payload);

    const refreshToken = randomBytes(24).toString("hex");
    await newUser.addToken(jwt, refreshToken);
    await newUser.save();

    return {jwt, refreshToken};
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne(
      {$or: [{email: loginUserDto.email}, {username: loginUserDto.username}]}
    );

    if (user && await user.comparePassword(loginUserDto.password)) {
      const payload = {email: user.email, username: user.username, sub: user._id};
      const jwt = this.jwtService.sign(payload);
      const refreshToken = randomBytes(24).toString("hex");

      await user.addToken(jwt, refreshToken);
      await user.save();

      return {jwt, refreshToken};
    }
    throw new Error("Invalid credentials");
  }

  async refreshToken(user: DocumentType<User>, refreshToken: string) {
    const tokenData = user.refreshTokens.find(token => token.refreshToken === refreshToken);

    if (!tokenData) {
      throw new BadRequestException("Invalid refresh token");
    }

    const payload = {email: user.email, username: user.username, sub: user._id};
    const jwt = this.jwtService.sign(payload);

    const newRefreshToken = randomBytes(24).toString("hex");

    await user.removeToken(tokenData.token);
    await user.addToken(jwt, refreshToken);
    await user.save();

    return {jwt, refreshToken: newRefreshToken};
  }


  async requestPasswordReset(email: string) {
    const user = await this.userModel.findOne({email})
    if (!user) {
      // throw new BadRequestException("User with given email does not exist");
      // We dont want to give any hints if the user exists or not
      return;
    }

    const {token, expires} = await this.generateResetToken();
    user.passwordResetToken = token;
    user.passwordResetExpires = expires;
    await user.save();

    // Send the token to the user's email
    await this.sendResetToken(email, token);
  }


  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel.findOne({passwordResetToken: resetPasswordDto.token});
    if (!user) {
      throw new BadRequestException("Invalid or expired password reset token");
    }

    if (user.passwordResetExpires < new Date()) {
      throw new GoneException("Password reset token has expired");
    }

    user.password = resetPasswordDto.newPassword;
    await user.hashPassword();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = [];

    await user.save();
  }

  async signOut(user: DocumentType<User>, token: string) {
    await user.removeToken(token);
    await user.save();
  }

  async generateResetToken() {
    const resetToken = randomBytes(20).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now
    return {token: resetToken, expires: resetTokenExpires};
  }

  async sendResetToken(email: string, token: string) {
    // Logic to send email
    console.log(`Sending password reset token to ${email}: ${token}`);
    // In production, replace the above line with actual email sending logic
  }
}
