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

  async create(createFarmerDto: CreateFarmerDto) {
    return this.userModel.create(createFarmerDto);
  }

  async findAll() {
    return this.userModel.find({ role: UserRole.FARMER }).lean().exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).lean().exec();
  }

  async update(id: string, updateFarmerDto: UpdateFarmerDto) {
    return this.userModel
      .findByIdAndUpdate(id, updateFarmerDto, { new: true })
      .lean()
      .exec();
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id).lean().exec();
  }
}
