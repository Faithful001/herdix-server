import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCropTypeDto } from './dto/create-crop-type.dto';
import { UpdateCropTypeDto } from './dto/update-crop-type.dto';
import { CropTypeRepository } from './crop-type.repository';

@Injectable()
export class CropTypeService {
  constructor(private readonly cropTypeRepository: CropTypeRepository) {}

  async create(createCropTypeDto: CreateCropTypeDto) {
    const createdCropType =
      await this.cropTypeRepository.create(createCropTypeDto);

    return {
      message: 'Crop type created',
      data: createdCropType,
    };
  }

  async findAll() {
    const cropTypes = await this.cropTypeRepository.findAll();
    return {
      message: 'Crops types fetched successfully',
      data: cropTypes,
    };
  }

  async findOne(id: string) {
    const cropType = await this.cropTypeRepository.findOne(id);
    if (!cropType) {
      throw new NotFoundException(`Crop type not found`);
    }
    return {
      message: 'Crop type fetched successfully',
      data: cropType,
    };
  }

  async findOneByName(name: string) {
    const cropType = await this.cropTypeRepository.findByName(name);
    if (!cropType) {
      throw new NotFoundException(`Crop type not found`);
    }
    return {
      message: 'Crop type fetched successfully',
      data: cropType,
    };
  }

  async update(id: string, updateCropTypeDto: UpdateCropTypeDto) {
    const updatedCropType = await this.cropTypeRepository.update(
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

  async delete(id: string) {
    const deletedCropType = await this.cropTypeRepository.delete(id);
    if (!deletedCropType) {
      throw new NotFoundException(`Crop type not found`);
    }
    return {
      message: 'Crop type deleted successfully',
      data: deletedCropType,
    };
  }
}
