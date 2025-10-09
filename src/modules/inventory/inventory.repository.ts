import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory } from './schemas/inventory.schema';
import { Model } from 'mongoose';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
  ) {}

  async createInventory(inventory: CreateInventoryDto) {
    const createdInventory = new this.inventoryModel(inventory);
    return createdInventory.save();
  }

  async findAllInventory(farmId: string) {
    return this.inventoryModel.find({ farmId }).exec();
  }

  async findInventoryById(farmId: string, id: string) {
    return this.inventoryModel.findOne({ farmId, _id: id }).exec();
  }

  async updateInventory(
    farmId: string,
    id: string,
    inventory: UpdateInventoryDto,
  ) {
    return this.inventoryModel
      .findOneAndUpdate({ farmId, _id: id }, inventory)
      .exec();
  }

  async deleteInventory(farmId: string, id: string) {
    return this.inventoryModel.findOneAndDelete({ farmId, _id: id }).exec();
  }
}
