import { Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "@m8a/nestjs-typegoose";
import { Room, Message } from "@shared/model/message.model";
import { User } from "@shared/model/user.model";


@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message) private readonly messageModel: ReturnModelType<typeof Message>,
    @InjectModel(Room) private readonly roomModel: ReturnModelType<typeof Room>,
  ) {}

  async create(user:  DocumentType<User>, roomId: string, content: string){
    const room = await this.roomModel.findById(roomId).exec();
    if (!room) {
      throw new Error('Room not found');
    }
    const createdMessage = new this.messageModel({ senderId: user, roomId, content });
    return createdMessage.save();
  }
}
