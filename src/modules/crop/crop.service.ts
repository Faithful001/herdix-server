import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCropDto, BulkCreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { CropRepository } from './crop.repository';
import { CropTypeRepository } from '../crop-type/crop-type.repository';

@Injectable()
export class CropService {
  // {name: id}
  private typeCache = new Map<string, string>(); // cache for livestock types

  constructor(
    private readonly cropRepository: CropRepository,
    private readonly cropTypeRepository: CropTypeRepository,
  ) {}

  /** Utility: resolve crop type with caching */
  private async resolveCropType(typeName: string): Promise<string> {
    if (this.typeCache.has(typeName)) {
      return this.typeCache.get(typeName);
    }
    const cropType = await this.cropTypeRepository.findByName(typeName);
    if (!cropType) throw new Error('Invalid crop type');

    const typeId = cropType._id.toString();
    this.typeCache.set(typeName, typeId);
    return typeId;
  }

  async create(createCropDto: CreateCropDto) {
    const typeId = await this.resolveCropType(createCropDto.type);
    const createdCrop = await this.cropRepository.create({
      ...createCropDto,
      type: typeId,
    });

    return {
      message: 'One crop created successfully',
      data: createdCrop,
    };
  }

  async createMany(createCropDtos: CreateCropDto[]) {
    if (!createCropDtos || createCropDtos.length === 0) {
      return {
        message: 'No crop provided',
        data: { crop: [], amount: 0 },
      };
    }

    // assume all crop share the same type
    const typeId = await this.resolveCropType(createCropDtos[0].type);

    const mappedDtos = createCropDtos.map((dto) => ({
      ...dto,
      type: typeId,
    }));

    const createdCrop = await this.cropRepository.createMany(mappedDtos);

    return {
      message: 'Many crops created successfully',
      data: { crop: createdCrop, amount: mappedDtos.length },
    };
  }

  async createBulk(createCropDto: BulkCreateCropDto) {
    const typeId = await this.resolveCropType(createCropDto.type);

    const bulkDtos = Array.from({ length: createCropDto.quantity }, () => ({
      ...createCropDto,
      type: typeId,
    }));

    const createdCrop = await this.cropRepository.createMany(bulkDtos);

    return {
      message: 'Bulk crops created successfully',
      data: {
        crop: createdCrop,
        quantity: bulkDtos.length,
      },
    };
  }

  async findAll() {
    const crop = await this.cropRepository.findAll();

    return {
      message: 'Crops fetched successfully',
      data: crop,
    };
  }

  async findOne(id: string) {
    const crop = await this.cropRepository.findById(id);
    if (!crop) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }
    return {
      message: 'Crop fetched successfully',
      data: crop,
    };
  }

  async findManyByType(type: string) {
    const crop = await this.cropRepository.findManyByCropType(type);

    if (!crop || crop.length === 0) {
      throw new NotFoundException(`No crop found for the type ${type}`);
    }

    return {
      message: `Crops of type ${type} fetched successfully`,
      data: crop,
    };
  }

  async update(id: string, updateCropDto: UpdateCropDto) {
    // resolve type if being updated
    if (updateCropDto.type) {
      updateCropDto.type = await this.resolveCropType(updateCropDto.type);
    }

    const updatedCrop = await this.cropRepository.update(id, updateCropDto);

    if (!updatedCrop) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }
    return {
      message: 'Crop updated successfully',
      data: updatedCrop,
    };
  }

  async delete(id: string) {
    const removedCrop = await this.cropRepository.delete(id);

    if (!removedCrop) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }
    return {
      message: 'Crop removed successfully',
      data: removedCrop,
    };
  }
}
