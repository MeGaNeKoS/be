import { mongoose, prop, Ref } from "@typegoose/typegoose";
import { User } from "@shared/model/user.model";

export class Room {
  @prop({default: () => new mongoose.Types.ObjectId()})
  _id: mongoose.Types.ObjectId;

  @prop({ref: () => User, required: true})
  members: Ref<User>[];

  @prop({required: true})
  name: string;
}

export class Message {
  @prop({default: () => new mongoose.Types.ObjectId()})
  _id: mongoose.Types.ObjectId;

  @prop({ref: () => User, required: true})
  senderId: Ref<User>;

  @prop({ref: () => Room, required: true})
  roomId: Ref<Room>;

  @prop({required: true})
  content: string;

  @prop({default: Date.now})
  timestamp: Date;
}




