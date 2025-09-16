import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCropTypeDto } from './dto/create-crop-type.dto';
import { UpdateCropTypeDto } from './dto/update-crop-type.dto';
import { CropTypeDocument, CropType } from './schemas/crop-type.schema';

@Injectable()
export class CropTypeRepository {
  constructor(
    @InjectModel(CropType.name)
    private readonly cropTypeModel: Model<CropTypeDocument>,
  ) {}

  create(farmId: string, createCropTypeDto: CreateCropTypeDto) {
    return this.cropTypeModel.create({ ...createCropTypeDto, farmId });
  }

  findAll(farmId: string) {
    return this.cropTypeModel.find({ farmId }).exec();
  }

  findOne(farmId: string, id: string) {
    return this.cropTypeModel.findOne({ farmId, _id: id }).exec();
  }

  findByName(farmId: string, name: string) {
    return this.cropTypeModel.findOne({ farmId, name }).exec();
  }

  update(farmId: string, id: string, updateCropTypeDto: UpdateCropTypeDto) {
    return this.cropTypeModel
      .findOneAndUpdate({ farmId, _id: id }, updateCropTypeDto, { new: true })
      .exec();
  }

  delete(farmId: string, id: string) {
    return this.cropTypeModel.findOneAndDelete({ farmId, _id: id }).exec();
  }
}
