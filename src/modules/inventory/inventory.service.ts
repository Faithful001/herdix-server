import { Injectable } from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async createInventory(
    farmId: string,
    createInventoryDto: CreateInventoryDto,
  ) {
    const createParamater = {
      ...createInventoryDto,
      farmId,
    };
    const createdInventory =
      await this.inventoryRepository.createInventory(createParamater);
    return {
      message: 'Inventory created successfully',
      data: createdInventory,
    };
  }

  async findAllInventory(farmId: string) {
    const inventories = await this.inventoryRepository.findAllInventory(farmId);
    return {
      message: 'Inventories fetched successfully',
      data: inventories,
    };
  }

  async findOneInventory(farmId: string, id: string) {
    const inventory = await this.inventoryRepository.findInventoryById(
      farmId,
      id,
    );
    return {
      message: 'Inventory fetched successfully',
      data: inventory,
    };
  }

  async updateInventory(
    farmId: string,
    id: string,
    updateInventoryDto: UpdateInventoryDto,
  ) {
    const updatedInventory = await this.inventoryRepository.updateInventory(
      farmId,
      id,
      updateInventoryDto,
    );
    return {
      message: 'Inventory updated successfully',
      data: updatedInventory,
    };
  }

  async deleteInventory(farmId: string, id: string) {
    const deletedInventory = await this.inventoryRepository.deleteInventory(
      farmId,
      id,
    );
    return {
      message: 'Inventory deleted successfully',
      data: deletedInventory,
    };
  }
}
