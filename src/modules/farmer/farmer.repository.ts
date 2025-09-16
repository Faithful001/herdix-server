import { Injectable } from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UserRole } from '../user/enums/user-role.enum';
import { UpdateFarmerDto } from './dto/update-farmer.dto';

@Injectable()
export class FarmerRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(farmId: string, createFarmerDto: CreateFarmerDto) {
    return this.userModel.create({ ...createFarmerDto, farmId });
  }

  async findAll(farmId: string) {
    return this.userModel.find({ role: UserRole.FARMER, farmId }).lean().exec();
  }

  async findById(farmId: string, id: string) {
    return this.userModel.findOne({ _id: id, farmId }).lean().exec();
  }

  async update(farmId: string, id: string, updateFarmerDto: UpdateFarmerDto) {
    return this.userModel
      .findOneAndUpdate({ _id: id, farmId }, updateFarmerDto, { new: true })
      .lean()
      .exec();
  }

  async delete(farmId: string, id: string) {
    return this.userModel.findOneAndDelete({ _id: id, farmId }).lean().exec();
  }
}
