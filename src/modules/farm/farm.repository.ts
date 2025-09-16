import { InjectModel } from '@nestjs/mongoose';
import { Farm, FarmDocument } from './schemas/farm.schema';
import { Model } from 'mongoose';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FarmRepository {
  constructor(
    @InjectModel(Farm.name) private readonly farmModel: Model<FarmDocument>,
  ) {}

  createFarm(createFarmDto: CreateFarmDto) {
    return this.farmModel.create({ ...createFarmDto });
  }

  getFarm(id: string) {
    return this.farmModel.findOne({ _id: id }).lean().exec();
  }

  updateFarm(id: string, updateFarmDto: UpdateFarmDto) {
    return this.farmModel.findOneAndUpdate({ _id: id }, updateFarmDto, {
      new: true,
    });
  }

  deleteFarm(id: string) {
    return this.farmModel.findOneAndDelete({ _id: id }).lean().exec();
  }
}
