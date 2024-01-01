import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";


import { Request } from "express";
import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "@profile/dto/create-profile.dto";
import { UpdateProfileDto } from "@profile/dto/update-profile.dto";
import { JwtAuthGuard } from "@shared/guard/jwt-auth.guard";
import { User } from "@shared/model/user.model";
import { DocumentType } from "@typegoose/typegoose";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("api/")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post("createProfile")
  async createProfile(@Req() req: Request & { user: DocumentType<User> }, @Body() createProfileDto: CreateProfileDto) {
    const profile = await this.profileService.createProfile(createProfileDto, req.user);
    if (!profile) {
      throw new HttpException("Profile already exists", HttpStatus.BAD_REQUEST);
    }
    return profile;
  }

  @UseGuards(JwtAuthGuard)
  @Get("getProfile")
  async getProfile(@Req() req: Request & { user: DocumentType<User> }) {
    const profile = await this.profileService.getProfile(req.user);
    if (!profile) {
      throw new HttpException("Profile not found", HttpStatus.NOT_FOUND);
    }
    return profile;
  }

  @UseGuards(JwtAuthGuard)
  @Put("updateProfile")
  async updateProfile(@Req() req: Request & { user: DocumentType<User> }, @Body() updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileService.updateProfile(updateProfileDto, req.user);
    if (!profile) {
      throw new HttpException("Profile not found", HttpStatus.NOT_FOUND);
    }
    return profile;
  }

  @UseGuards(JwtAuthGuard)
  @Post("uploadProfilePicture")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File, @Req() req: Request & {
    user: DocumentType<User>
  }) {
    return this.profileService.uploadProfilePicture(req.user, file);
  }
}
