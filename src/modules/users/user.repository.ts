import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './users.schema';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(createUserDto);
  }

  async findAllUsers(role: UserRole): Promise<UserDocument[]> {
    return this.userModel.find({ role }).lean().exec();
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).lean().exec();
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .lean()
      .exec();
  }

  async deleteUser(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).lean().exec();
  }
}
