import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Livestock, LivestockDocument } from './schemas/livestock.schema';
import { Model } from 'mongoose';
import {
  BulkCreateLivestockDto,
  CreateLivestockDto,
} from './dto/create-livestock.dto';
import {
  LivestockType,
  LivestockTypeDocument,
} from '../livestock-type/schemas/livestock-type.schema';
import { UpdateLivestockDto } from './dto/update-livestock.dto';
import { Types } from 'mongoose';

@Injectable()
export class LivestockRepository {
  constructor(
    @InjectModel(Livestock.name)
    private readonly livestockModel: Model<LivestockDocument>,
    @InjectModel(LivestockType.name)
    private readonly livestockTypeModel: Model<LivestockTypeDocument>,
  ) {}

  // Create
  create(farmId: string, createLivestockDto: CreateLivestockDto) {
    return this.livestockModel.create({
      ...createLivestockDto,
      farmId,
    });
  }

  // Create many
  async createMany(
    farmId: string,
    createLivestockDtos: CreateLivestockDto[],
    options: { validate?: boolean } = { validate: true },
  ) {
    if (options.validate) {
      // Ensures validation + hooks (slower but safer)
      return this.livestockModel.create({
        ...createLivestockDtos,
        farmId,
      });
    } else {
      // Faster, skips middleware/validation unless explicitly enabled
      return this.livestockModel.insertMany(
        {
          ...createLivestockDtos,
          farmId,
        },
        {
          ordered: false,
        },
      );
    }
  }

  //Create Bulk
  async createBulk(farmId: string, bulkDto: BulkCreateLivestockDto) {
    const { quantity, ...data } = bulkDto;
    const docs = Array.from({ length: quantity }, () => ({ ...data }));
    return this.livestockModel.insertMany({
      ...docs,
      farmId,
    });
  }

  // Find all
  findAll(farmId: string, order: 'asc' | 'desc' = 'desc') {
    return this.livestockModel
      .find({ farmId })
      .sort({ createdAt: order === 'asc' ? 1 : -1 })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Find by ID
  findById(farmId: string, livestockId: string) {
    return this.livestockModel
      .findOne({ _id: livestockId, farmId })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Find by type (returns array)
  async findManyByLivestockType(farmId: string, livestockType: string) {
    const liveStockTypeDoc = await this.livestockTypeModel
      .findOne({ name: livestockType, farmId })
      .lean()
      .exec();

    // Return empty array; service decides what to do if not found
    if (!liveStockTypeDoc) return [];
    return this.livestockModel
      .find({ type: liveStockTypeDoc._id.toString() })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Update
  async update(
    farmId: string,
    livestockId: string,
    updateData: UpdateLivestockDto,
  ) {
    return this.livestockModel
      .findOneAndUpdate({ farmId, _id: livestockId }, updateData, { new: true })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Delete
  async delete(farmId: string, livestockId: string) {
    return this.livestockModel
      .findByIdAndDelete({ farmId, _id: livestockId })
      .populate('type', 'name description')
      .lean()
      .exec();
  }
}
