import { Injectable } from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UserRole } from '../user/enums/user-role.enum';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { Farmer, FarmerDocument } from './schemas/farmer.schema';

@Injectable()
export class FarmerRepository {
  constructor(
    @InjectModel(Farmer.name)
    private readonly farmerModel: Model<FarmerDocument>,
  ) {}

  async create(farmId: string, createFarmerDto: CreateFarmerDto) {
    return this.farmerModel.create({
      ...createFarmerDto,
      farmId,
    });
  }

  async findAll(farmId: string) {
    return this.farmerModel.find({ farmId }).lean().exec();
  }

  async findById(farmId: string, id: string) {
    return this.farmerModel.findOne({ _id: id, farmId }).lean().exec();
  }

  async update(farmId: string, id: string, updateFarmerDto: UpdateFarmerDto) {
    return this.farmerModel
      .findOneAndUpdate({ _id: id, farmId }, updateFarmerDto, { new: true })
      .lean()
      .exec();
  }

  async delete(farmId: string, id: string) {
    return this.farmerModel.findOneAndDelete({ _id: id, farmId }).lean().exec();
  }
}
