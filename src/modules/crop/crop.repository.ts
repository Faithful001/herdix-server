import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BulkCreateCropDto, CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import {
  CropType,
  CropTypeDocument,
} from '../crop-type/schemas/crop-type.schema';
import { Crop, CropDocument } from './schemas/crop.schema';

@Injectable()
export class CropRepository {
  constructor(
    @InjectModel(Crop.name)
    private readonly cropModel: Model<CropDocument>,
    @InjectModel(CropType.name)
    private readonly cropTypeModel: Model<CropTypeDocument>,
  ) {}

  // Create
  create(farmId: string, createCropDto: CreateCropDto) {
    return this.cropModel.create({ ...createCropDto, farmId });
  }

  // Create many
  async createMany(
    farmId: string,
    createCropDtos: CreateCropDto[],
    options: { validate?: boolean } = { validate: true },
  ) {
    if (options.validate) {
      // Ensures validation + hooks (slower but safer)
      return this.cropModel.create({ ...createCropDtos, farmId });
    } else {
      // Faster, skips middleware/validation unless explicitly enabled
      return this.cropModel.insertMany(
        { ...createCropDtos, farmId },
        {
          ordered: false,
        },
      );
    }
  }

  //Create Bulk
  async createBulk(farmId: string, bulkDto: BulkCreateCropDto) {
    const { quantity, ...data } = bulkDto;
    const docs = Array.from({ length: quantity }, () => ({ ...data }));
    return this.cropModel.insertMany(
      { ...docs, farmId },
      {
        ordered: false,
      },
    );
  }

  // Find all
  findAll(farmId: string, order: 'asc' | 'desc' = 'desc') {
    return this.cropModel
      .find({ farmId })
      .sort({ createdAt: order === 'asc' ? 1 : -1 })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Find by ID
  findById(farmId: string, cropId: string) {
    return this.cropModel
      .findOne({ _id: cropId, farmId })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Find by type (returns array)
  async findManyByCropType(farmId: string, cropType: string) {
    const cropTypeDoc = await this.cropTypeModel
      .findOne({ name: cropType, farmId })
      .lean()
      .exec();

    // Return empty array; service decides what to do if not found
    if (!cropTypeDoc) return [];
    return this.cropModel
      .find({ type: cropTypeDoc._id.toString(), farmId })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Update
  async update(farmId: string, cropId: string, updateData: UpdateCropDto) {
    return this.cropModel
      .findOneAndUpdate({ _id: cropId, farmId }, updateData, { new: true })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Delete
  async delete(farmId: string, cropId: string) {
    return this.cropModel
      .findOneAndDelete({ _id: cropId, farmId })
      .populate('type', 'name description')
      .lean()
      .exec();
  }
}
