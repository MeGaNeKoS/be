import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { RoomService } from './room.service';

import { JwtAuthGuard } from '@shared/guard/jwt-auth.guard';
import { Request } from 'express';
import { DocumentType } from "@typegoose/typegoose";
import { User } from "@shared/model/user.model";
import { CreateRoomDto } from "@/room/src/dto/create-room.dto";
import { UpdateRoomDto } from "@/room/src/dto/update-room.dto";

@Controller('api')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(JwtAuthGuard)
  @Post("room")
  async create(@Req() req: Request & { user: DocumentType<User> }, @Body()  room: CreateRoomDto){
    return this.roomService.create(req.user, room);
  }

  @UseGuards(JwtAuthGuard)
  @Get("room")
  async findAll(@Req() req: Request & { user: DocumentType<User> }){
    return this.roomService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('room/:id')
  async findById(@Req() req: Request & { user: DocumentType<User> }, @Param('id') id: string){
    return this.roomService.findById(req.user, id );
  }

  @UseGuards(JwtAuthGuard)
  @Put('room/:id')
  async update(@Req() req: Request & { user: DocumentType<User> }, @Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto){
    return this.roomService.update(req.user, id, updateRoomDto );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('room/:id')
  async delete(@Req() req: Request & { user: DocumentType<User> }, @Param('id') id: string){
    return this.roomService.delete(req.user, id);
  }
}
