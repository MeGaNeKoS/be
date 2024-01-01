import { prop, Ref, mongoose } from "@typegoose/typegoose";
import { User } from "@shared/model/user.model";


export class Profile {
  @prop({ default: () => new mongoose.Types.ObjectId() })
  _id: mongoose.Types.ObjectId;

  @prop({ ref: () => User, required: true })
  userId: Ref<User>;

  @prop()
  displayName: string;

  @prop()
  birthday: Date;

  @prop()
  height: number;

  @prop()
  weight: number;

  @prop({ type: () => [String] })
  interests: string[];

  @prop()
  gender: string;

  @prop()
  profilePicture: string;

}

