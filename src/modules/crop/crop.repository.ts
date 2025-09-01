import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BulkCreateCropDto, CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import {
  CropType,
  CropTypeDocument,
} from '../crop-type/schema/crop-type.schema';
import { Crop, CropDocument } from './schema/crop.schema';

@Injectable()
export class CropRepository {
  constructor(
    @InjectModel(Crop.name)
    private readonly cropModel: Model<CropDocument>,
    @InjectModel(CropType.name)
    private readonly cropTypeModel: Model<CropTypeDocument>,
  ) {}

  // Create
  create(createCropDto: CreateCropDto) {
    return this.cropModel.create(createCropDto);
  }

  // Create many
  async createMany(
    createCropDtos: CreateCropDto[],
    options: { validate?: boolean } = { validate: true },
  ) {
    if (options.validate) {
      // Ensures validation + hooks (slower but safer)
      return this.cropModel.create(createCropDtos);
    } else {
      // Faster, skips middleware/validation unless explicitly enabled
      return this.cropModel.insertMany(createCropDtos, {
        ordered: false,
      });
    }
  }

  //Create Bulk
  async createBulk(bulkDto: BulkCreateCropDto) {
    const { quantity, ...data } = bulkDto;
    const docs = Array.from({ length: quantity }, () => ({ ...data }));
    return this.cropModel.insertMany(docs);
  }

  // Find all
  findAll(order: 'asc' | 'desc' = 'desc') {
    return this.cropModel
      .find()
      .sort({ createdAt: order === 'asc' ? 1 : -1 })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Find by ID
  findById(cropId: string) {
    return this.cropModel
      .findById(cropId)
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Find by type (returns array)
  async findManyByCropType(cropType: string) {
    const cropTypeDoc = await this.cropTypeModel
      .findOne({ name: cropType })
      .lean()
      .exec();

    // Return empty array; service decides what to do if not found
    if (!cropTypeDoc) return [];
    return this.cropModel
      .find({ type: cropTypeDoc._id.toString() })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Update
  async update(cropId: string, updateData: UpdateCropDto) {
    return this.cropModel
      .findByIdAndUpdate(cropId, updateData, { new: true })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Delete
  async delete(cropId: string) {
    return this.cropModel
      .findByIdAndDelete(cropId)
      .populate('type', 'name description')
      .lean()
      .exec();
  }
}
