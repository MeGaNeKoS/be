import { Injectable } from "@nestjs/common";

import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { Room } from "@shared/model/message.model";
import { InjectModel } from "@m8a/nestjs-typegoose";
import { User } from "@shared/model/user.model";
import { CreateRoomDto } from "@/room/src/dto/create-room.dto";
import { UpdateRoomDto } from "@/room/src/dto/update-room.dto";

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room) private readonly roomModel: ReturnModelType<typeof Room>,
  ) {
  }

  async create(user: DocumentType<User>, room: CreateRoomDto) {

    const createdRoom = new this.roomModel({...room});
    if (!createdRoom.members.includes(user._id)) {
      createdRoom.members.push(user._id);
    }
    return createdRoom.save();
  }

  async findAll(user: DocumentType<User>) {
    return this.roomModel.find({members: user}).exec();
  }

  async findById(user: DocumentType<User>, roomId: string) {
    const room = await this.roomModel.findById(roomId).exec();
    if (room && room.members.includes(user._id)) {
      return room;
    }
    return null;
  }

  async update(user: DocumentType<User>, room_id: string, updateRoomDto: UpdateRoomDto){
    console.log(updateRoomDto)
    const members = updateRoomDto.members
    const room = await this.roomModel.findByIdAndUpdate(room_id, {members}, {new: true}).exec();
    if (room) {
      if (!room.members.includes(user._id)) {
        room.members.push(user);
      }
      return room.save();
    }
    return null;
  }

  async delete(user: DocumentType<User>, id: string) {
    const room = await this.roomModel.findById(id).exec();
    if (room && room.members.includes(user._id)) {
      await room.deleteOne();
      return room;
    }
    return null;
  }
}
