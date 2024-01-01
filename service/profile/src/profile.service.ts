import { ConflictException, Injectable } from "@nestjs/common";
import { CreateProfileDto } from "@profile/dto/create-profile.dto";
import { UpdateProfileDto } from "@profile/dto/update-profile.dto";
import { InjectModel } from "@m8a/nestjs-typegoose";
import { User } from "@shared/model/user.model";
import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { Profile } from "@shared/model/profile.model";
import { StorageService } from "@shared/storage/storage";

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private readonly profileModel: ReturnModelType<typeof Profile>,
    private readonly storageService: StorageService,
  ) {
  }

  async createProfile(createProfileDto: CreateProfileDto, user: DocumentType<User>) {
    const profile = await this.profileModel.findOne({userId: user._id});
    if (profile) {
      throw new ConflictException("Profile already exists");
    }

    const newProfile = new this.profileModel({
      ...createProfileDto,
      userId: user._id
    });
    return await newProfile.save();
  }

  async getProfile(user: DocumentType<User>) {
    return this.profileModel.findOne({userId: user._id});
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, user: DocumentType<User>) {
    const profile = await this.profileModel.findOneAndUpdate(
      {userId: user._id},
      {...updateProfileDto},
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return await profile.save()
  }

  async uploadProfilePicture(user: DocumentType<User>, file: Express.Multer.File) {
    const profilePictureUrl = await this.storageService.upload(file);

    const profile = await this.profileModel.findOne({userId: user._id});
    profile.profilePicture = profilePictureUrl;
    await profile.save();

    return profile;
  }
}


