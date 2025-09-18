import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UserRole } from '../user/enums/user-role.enum';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(farmId: string, createAdminDto: CreateAdminDto) {
    return this.userModel.create({
      ...createAdminDto,
      role: UserRole.ADMIN,
      farmId,
    });
  }

  async findAll(farmId: string) {
    return this.userModel.find({ role: UserRole.ADMIN, farmId }).lean().exec();
  }

  async findById(farmId: string, id: string) {
    return this.userModel
      .findOne({ _id: id, farmId, role: UserRole.ADMIN })
      .lean()
      .exec();
  }
  async findByEmail(farmId: string, email: string) {
    return this.userModel
      .findOne({ email, farmId, role: UserRole.ADMIN })
      .lean()
      .exec();
  }

  async update(farmId: string, id: string, updateAdminDto: UpdateAdminDto) {
    return this.userModel
      .findOneAndUpdate(
        { _id: id, farmId, role: UserRole.ADMIN },
        updateAdminDto,
        {
          new: true,
        },
      )
      .lean()
      .exec();
  }

  async delete(farmId: string, id: string) {
    return this.userModel
      .findOneAndDelete({ _id: id, farmId, role: UserRole.ADMIN })
      .lean()
      .exec();
  }
}
