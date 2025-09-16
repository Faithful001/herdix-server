import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  LivestockType,
  LivestockTypeDocument,
} from './schemas/livestock-type.schema';
import { Model } from 'mongoose';
import { CreateLivestockTypeDto } from './dto/create-livestock-type.dto';
import { UpdateLivestockTypeDto } from './dto/update-livestock-type.dto';

@Injectable()
export class LivestockTypeRepository {
  constructor(
    @InjectModel(LivestockType.name)
    private readonly livestockTypeModel: Model<LivestockTypeDocument>,
  ) {}

  create(farmId: string, createLivestockTypeDto: CreateLivestockTypeDto) {
    return this.livestockTypeModel.create({
      ...createLivestockTypeDto,
      farmId,
    });
  }

  findAll(farmId: string) {
    return this.livestockTypeModel.find({ farmId }).exec();
  }

  findOne(farmId: string, id: string) {
    return this.livestockTypeModel.findOne({ _id: id, farmId }).exec();
  }

  findByName(farmId: string, name: string) {
    return this.livestockTypeModel.findOne({ name, farmId }).exec();
  }

  update(
    farmId: string,
    id: string,
    updateLivestockTypeDto: UpdateLivestockTypeDto,
  ) {
    return this.livestockTypeModel
      .findOneAndUpdate({ _id: id, farmId }, updateLivestockTypeDto, {
        new: true,
      })
      .exec();
  }

  delete(farmId: string, id: string) {
    return this.livestockTypeModel.findOneAndDelete({ _id: id, farmId }).exec();
  }
}
