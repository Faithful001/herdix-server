import { Injectable } from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmRepository } from './farm.repository';
import { Request } from 'express';

@Injectable()
export class FarmService {
  constructor(private readonly farmRepository: FarmRepository) {}
  async create(createFarmDto: CreateFarmDto) {
    const createdFarm = await this.farmRepository.createFarm(createFarmDto);
    console.log('createdFarm', createdFarm);
    return {
      message: 'Farm created successfully',
      data: createdFarm,
    };
  }

  async findOne(request: Request) {
    const farmId = request.user.farmId;
    const farmDoc = await this.farmRepository.getFarm(farmId);
    return {
      message: 'Farm retrieved successfully',
      data: farmDoc,
    };
  }

  async update(request: Request, updateFarmDto: UpdateFarmDto) {
    const farmId = request.user.farmId;
    const updatedFarm = await this.farmRepository.updateFarm(
      farmId,
      updateFarmDto,
    );
    return {
      message: 'Farm updated successfully',
      data: updatedFarm,
    };
  }

  async remove(request: Request) {
    const farmId = request.user.farmId;
    const deletedFarm = await this.farmRepository.deleteFarm(farmId);
    return {
      message: 'Farm deleted successfully',
      data: deletedFarm,
    };
  }
}
