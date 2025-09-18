import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserRole } from './enums/user-role.enum';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: RegisterDto): Promise<UserDocument> {
    return this.userModel.create(createUserDto);
  }

  async findAllUsers(role: UserRole): Promise<UserDocument[]> {
    return this.userModel.find({ role }).lean().exec();
  }

  async findUserByEmail(
    email: string,
    role?: UserRole,
    farmId?: string,
  ): Promise<UserDocument | null> {
    const baseCondition = { email };

    if (farmId) {
      baseCondition['farmId'] = farmId;
    }

    if (role) {
      return this.userModel
        .findOne({
          $or: [baseCondition, { role }],
        })
        .exec();
    }

    // If no role is provided, just farmId && email
    return this.userModel.findOne(baseCondition).exec();
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
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
