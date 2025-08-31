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

@Injectable()
export class LivestockRepository {
  constructor(
    @InjectModel(Livestock.name)
    private readonly livestockModel: Model<LivestockDocument>,
    @InjectModel(LivestockType.name)
    private readonly livestockTypeModel: Model<LivestockTypeDocument>,
  ) {}

  // Create
  create(createLivestockDto: CreateLivestockDto) {
    return this.livestockModel.create(createLivestockDto);
  }

  // Create many
  async createMany(
    createLivestockDtos: CreateLivestockDto[],
    options: { validate?: boolean } = { validate: true },
  ) {
    if (options.validate) {
      // Ensures validation + hooks (slower but safer)
      return this.livestockModel.create(createLivestockDtos);
    } else {
      // Faster, skips middleware/validation unless explicitly enabled
      return this.livestockModel.insertMany(createLivestockDtos, {
        ordered: false,
      });
    }
  }

  //Create Bulk
  async createBulk(bulkDto: BulkCreateLivestockDto) {
    const { quantity, ...data } = bulkDto;
    const docs = Array.from({ length: quantity }, () => ({ ...data }));
    return this.livestockModel.insertMany(docs);
  }

  // Find all
  findAll(order: 'asc' | 'desc' = 'desc') {
    return this.livestockModel
      .find()
      .sort({ createdAt: order === 'asc' ? 1 : -1 })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Find by ID
  findById(livestockId: string) {
    return this.livestockModel
      .findById(livestockId)
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Find by type (returns array)
  async findManyByLivestockType(livestockType: string) {
    const liveStockTypeDoc = await this.livestockTypeModel
      .findOne({ name: livestockType })
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
  async update(livestockId: string, updateData: UpdateLivestockDto) {
    return this.livestockModel
      .findByIdAndUpdate(livestockId, updateData, { new: true })
      .populate('type', 'name description')
      .lean()
      .exec();
  }

  // Delete
  async delete(livestockId: string) {
    return this.livestockModel
      .findByIdAndDelete(livestockId)
      .populate('type', 'name description')
      .lean()
      .exec();
  }
}
