import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCropTypeDto } from './dto/create-crop-type.dto';
import { UpdateCropTypeDto } from './dto/update-crop-type.dto';
import { CropTypeRepository } from './crop-type.repository';
import { Request } from 'express';

@Injectable()
export class CropTypeService {
  constructor(private readonly cropTypeRepository: CropTypeRepository) {}

  async create(request: Request, createCropTypeDto: CreateCropTypeDto) {
    const farmId = request.user.farmId;
    const createdCropType = await this.cropTypeRepository.create(
      farmId,
      createCropTypeDto,
    );

    return {
      message: 'Crop type created',
      data: createdCropType,
    };
  }

  async findAll(request: Request) {
    const farmId = request.user.farmId;
    const cropTypes = await this.cropTypeRepository.findAll(farmId);
    return {
      message: 'Crops types fetched successfully',
      data: cropTypes,
    };
  }

  async findOne(request: Request, id: string) {
    const farmId = request.user.farmId;
    const cropType = await this.cropTypeRepository.findOne(farmId, id);
    if (!cropType) {
      throw new NotFoundException(`Crop type not found`);
    }
    return {
      message: 'Crop type fetched successfully',
      data: cropType,
    };
  }

  async findOneByName(request: Request, name: string) {
    const farmId = request.user.farmId;
    const cropType = await this.cropTypeRepository.findByName(farmId, name);
    if (!cropType) {
      throw new NotFoundException(`Crop type not found`);
    }
    return {
      message: 'Crop type fetched successfully',
      data: cropType,
    };
  }

  async update(
    request: Request,
    id: string,
    updateCropTypeDto: UpdateCropTypeDto,
  ) {
    const farmId = request.user.farmId;
    const updatedCropType = await this.cropTypeRepository.update(
      farmId,
      id,
      updateCropTypeDto,
    );
    if (!updatedCropType) {
      throw new NotFoundException(`Crop type not found`);
    }
    return {
      message: 'Crop type updated successfully',
      data: updatedCropType,
    };
  }

  async delete(request: Request, id: string) {
    const farmId = request.user.farmId;
    const deletedCropType = await this.cropTypeRepository.delete(farmId, id);
    if (!deletedCropType) {
      throw new NotFoundException(`Crop type not found`);
    }
    return {
      message: 'Crop type deleted successfully',
      data: deletedCropType,
    };
  }
}
