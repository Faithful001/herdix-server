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

  create(createLivestockTypeDto: CreateLivestockTypeDto) {
    return this.livestockTypeModel.create(createLivestockTypeDto);
  }

  findAll() {
    return this.livestockTypeModel.find().exec();
  }

  findOne(id: string) {
    return this.livestockTypeModel.findById(id).exec();
  }

  findByName(name: string) {
    return this.livestockTypeModel.findOne({ name }).exec();
  }

  update(id: string, updateLivestockTypeDto: UpdateLivestockTypeDto) {
    return this.livestockTypeModel
      .findByIdAndUpdate(id, updateLivestockTypeDto, { new: true })
      .exec();
  }

  delete(id: string) {
    return this.livestockTypeModel.findByIdAndDelete(id).exec();
  }
}
