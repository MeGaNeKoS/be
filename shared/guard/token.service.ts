import { Injectable } from "@nestjs/common";

import { Model } from "mongoose";
import { User } from "@shared/model/user.model";
import { InjectModel } from "@m8a/nestjs-typegoose";
import { DocumentType } from "@typegoose/typegoose";


@Injectable()
export class TokenService {
  constructor(@InjectModel(User) private userModel: Model<User>) {
  }

  async validateUserToken(userId: string, token: string) {
    const user = await this.userModel.findById<DocumentType<User>>(userId);
    if (!user || !user.refreshTokens.some((userToken) => userToken.token === token)) {
      return false;
    }

    return user
  }
}
