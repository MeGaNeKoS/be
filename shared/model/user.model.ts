import { prop, mongoose  } from "@typegoose/typegoose";
import * as bcrypt from "bcrypt";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class Token {
  @prop({ required: true })
  public token: string;

  @prop({ required: true })
  public refreshToken: string;

  @prop({ required: true })
  public createdAt: Date;
}

export class User extends TimeStamps {
  @prop({ default: () => new mongoose.Types.ObjectId() })
  _id: mongoose.Types.ObjectId;

  @prop({required: true, unique: true})
  email: string;

  @prop({required: true, unique: true})
  username: string;

  @prop({required: true})
  password: string;

  @prop({default: false})
  isEmailVerified: boolean;

  @prop({default: true})
  isActive: boolean;

  @prop()
  passwordResetToken: string;

  @prop()
  passwordResetExpires: Date;

  @prop({ type: () => [Token] })
  refreshTokens: Token[];

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  async addToken(token: string, refreshToken: string) {
    this.refreshTokens.push({ token: token, refreshToken: refreshToken, createdAt: new Date() });
  }

  async removeToken(token: string) {
    this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
  }
}

