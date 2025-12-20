import { Injectable } from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class InventoryService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly cacheService: CacheService,
  ) {}

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
    if (this.cacheService.get(`inventories_${farmId}`)) {
      return await this.cacheService.get(`inventories_${farmId}`);
    }

    const inventories = await this.inventoryRepository.findAllInventory(farmId);
    await this.cacheService.set(`inventories_${farmId}`, inventories);
    return inventories;
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
