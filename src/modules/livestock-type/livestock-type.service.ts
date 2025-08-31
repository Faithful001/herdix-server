import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLivestockTypeDto } from './dto/create-livestock-type.dto';
import { UpdateLivestockTypeDto } from './dto/update-livestock-type.dto';
import { LivestockTypeRepository } from './livestock-type.repository';

@Injectable()
export class LivestockTypeService {
  constructor(
    private readonly livestockTypeRepository: LivestockTypeRepository,
  ) {}

  async create(createLivestockTypeDto: CreateLivestockTypeDto) {
    const createdLiveStockType = await this.livestockTypeRepository.create(
      createLivestockTypeDto,
    );

    return {
      message: 'Livestock type created',
      data: createdLiveStockType,
    };
  }

  async findAll() {
    const livestockTypes = await this.livestockTypeRepository.findAll();
    return {
      message: 'Livestock types fetched successfully',
      data: livestockTypes,
    };
  }

  async findOne(id: string) {
    const livestockType = await this.livestockTypeRepository.findOne(id);
    if (!livestockType) {
      throw new NotFoundException(`Livestock type not found`);
    }
    return {
      message: 'Livestock type fetched successfully',
      data: livestockType,
    };
  }

  async findOneByName(name: string) {
    const livestockType = await this.livestockTypeRepository.findByName(name);
    if (!livestockType) {
      throw new NotFoundException(`Livestock type not found`);
    }
    return {
      message: 'Livestock type fetched successfully',
      data: livestockType,
    };
  }

  async update(id: string, updateLivestockTypeDto: UpdateLivestockTypeDto) {
    const updatedLivestockType = await this.livestockTypeRepository.update(
      id,
      updateLivestockTypeDto,
    );
    if (!updatedLivestockType) {
      throw new NotFoundException(`Livestock type not found`);
    }
    return {
      message: 'Livestock type updated successfully',
      data: updatedLivestockType,
    };
  }

  async delete(id: string) {
    const deletedLivestockType = await this.livestockTypeRepository.delete(id);
    if (!deletedLivestockType) {
      throw new NotFoundException(`Livestock type not found`);
    }
    return {
      message: 'Livestock type deleted successfully',
      data: deletedLivestockType,
    };
  }
}
