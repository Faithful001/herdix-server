import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLivestockTypeDto } from './dto/create-livestock-type.dto';
import { UpdateLivestockTypeDto } from './dto/update-livestock-type.dto';
import { LivestockTypeRepository } from './livestock-type.repository';
import { Request } from 'express';

@Injectable()
export class LivestockTypeService {
  constructor(
    private readonly livestockTypeRepository: LivestockTypeRepository,
  ) {}

  async create(
    request: Request,
    createLivestockTypeDto: CreateLivestockTypeDto,
  ) {
    const farmId = request.user.farmId;
    const createdLiveStockType = await this.livestockTypeRepository.create(
      farmId,
      createLivestockTypeDto,
    );

    return {
      message: 'Livestock type created',
      data: createdLiveStockType,
    };
  }

  async findAll(request: Request) {
    const farmId = request.user.farmId;
    const livestockTypes = await this.livestockTypeRepository.findAll(farmId);
    return {
      message: 'Livestock types fetched successfully',
      data: livestockTypes,
    };
  }

  async findOne(request: Request, id: string) {
    const farmId = request.user.farmId;
    const livestockType = await this.livestockTypeRepository.findOne(
      farmId,
      id,
    );
    if (!livestockType) {
      throw new NotFoundException(`Livestock type not found`);
    }
    return {
      message: 'Livestock type fetched successfully',
      data: livestockType,
    };
  }

  async findOneByName(request: Request, name: string) {
    const farmId = request.user.farmId;
    const livestockType = await this.livestockTypeRepository.findByName(
      farmId,
      name,
    );
    if (!livestockType) {
      throw new NotFoundException(`Livestock type not found`);
    }
    return {
      message: 'Livestock type fetched successfully',
      data: livestockType,
    };
  }

  async update(
    request: Request,
    id: string,
    updateLivestockTypeDto: UpdateLivestockTypeDto,
  ) {
    const farmId = request.user.farmId;
    const updatedLivestockType = await this.livestockTypeRepository.update(
      farmId,
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

  async delete(request: Request, id: string) {
    const farmId = request.user.farmId;
    const deletedLivestockType = await this.livestockTypeRepository.delete(
      farmId,
      id,
    );
    if (!deletedLivestockType) {
      throw new NotFoundException(`Livestock type not found`);
    }
    return {
      message: 'Livestock type deleted successfully',
      data: deletedLivestockType,
    };
  }
}
