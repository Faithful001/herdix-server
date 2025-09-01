import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCropTypeDto } from './dto/create-crop-type.dto';
import { UpdateCropTypeDto } from './dto/update-crop-type.dto';
import { CropTypeDocument, CropType } from './schema/crop-type.schema';

@Injectable()
export class CropTypeRepository {
  constructor(
    @InjectModel(CropType.name)
    private readonly cropTypeModel: Model<CropTypeDocument>,
  ) {}

  create(createCropTypeDto: CreateCropTypeDto) {
    return this.cropTypeModel.create(createCropTypeDto);
  }

  findAll() {
    return this.cropTypeModel.find().exec();
  }

  findOne(id: string) {
    return this.cropTypeModel.findById(id).exec();
  }

  findByName(name: string) {
    return this.cropTypeModel.findOne({ name }).exec();
  }

  update(id: string, updateCropTypeDto: UpdateCropTypeDto) {
    return this.cropTypeModel
      .findByIdAndUpdate(id, updateCropTypeDto, { new: true })
      .exec();
  }

  delete(id: string) {
    return this.cropTypeModel.findByIdAndDelete(id).exec();
  }
}
