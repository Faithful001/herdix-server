import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCropDto, BulkCreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { CropRepository } from './crop.repository';
import { CropTypeRepository } from '../crop-type/crop-type.repository';
import { Request } from 'express';
import { CacheService } from 'src/common/services/cache.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CropService {
  constructor(
    private readonly cropRepository: CropRepository,
    private readonly cropTypeRepository: CropTypeRepository,
    private readonly cacheService: CacheService,
  ) {}

  /** Utility: resolve crop type with caching */
  private async resolveCropType(
    request: Request,
    typeName: string,
  ): Promise<string> {
    const farmId = request.user.farmId;
    // check redis cache first
    if (this.cacheService.get('crop-type-' + farmId + '-' + typeName)) {
      return await this.cacheService.get(
        'crop-type-' + farmId + '-' + typeName,
      );
    }
    const cropType = await this.cropTypeRepository.findByName(farmId, typeName);
    if (!cropType) throw new Error('Invalid crop type');

    const typeId = cropType._id.toString();
    await this.cacheService.set('crop-type-' + farmId + '-' + typeName, typeId);
    return typeId;
  }

  async create(request: Request, createCropDto: CreateCropDto) {
    const farmId = request.user.farmId;
    const typeId = await this.resolveCropType(request, createCropDto.type);
    const createdCrop = await this.cropRepository.create(farmId, {
      ...createCropDto,
      type: typeId,
    });

    return {
      message: 'One crop created successfully',
      data: createdCrop,
    };
  }

  async createMany(request: Request, createCropDtos: CreateCropDto[]) {
    const farmId = request.user.farmId;
    if (!createCropDtos || createCropDtos.length === 0) {
      return {
        message: 'No crop provided',
        data: { crop: [], amount: 0 },
      };
    }

    // assume all crop share the same type
    const typeId = await this.resolveCropType(request, createCropDtos[0].type);

    const mappedDtos = createCropDtos.map((dto) => ({
      ...dto,
      type: typeId,
    }));

    const createdCrop = await this.cropRepository.createMany(
      farmId,
      mappedDtos,
    );

    return {
      message: 'Many crops created successfully',
      data: { crop: createdCrop, amount: mappedDtos.length },
    };
  }

  async createBulk(request: Request, createCropDto: BulkCreateCropDto) {
    const farmId = request.user.farmId;

    const typeId = await this.resolveCropType(request, createCropDto.type);

    const bulkDtos = Array.from({ length: createCropDto.quantity }, () => ({
      ...createCropDto,
      type: typeId,
    }));

    const createdCrop = await this.cropRepository.createMany(farmId, bulkDtos);

    return {
      message: 'Bulk crops created successfully',
      data: {
        crop: createdCrop,
        quantity: bulkDtos.length,
      },
    };
  }

  async findAll(request: Request) {
    const farmId = request.user.farmId;
    const crop = await this.cropRepository.findAll(farmId);

    return {
      message: 'Crops fetched successfully',
      data: crop,
    };
  }

  async findOne(request: Request, id: string) {
    const farmId = request.user.farmId;
    const crop = await this.cropRepository.findById(farmId, id);
    if (!crop) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }
    return {
      message: 'Crop fetched successfully',
      data: crop,
    };
  }

  async findManyByType(request: Request, type: string) {
    const farmId = request.user.farmId;
    const crop = await this.cropRepository.findManyByCropType(farmId, type);

    if (!crop || crop.length === 0) {
      throw new NotFoundException(`No crop found for the type ${type}`);
    }

    return {
      message: `Crops of type ${type} fetched successfully`,
      data: crop,
    };
  }

  async update(request: Request, id: string, updateCropDto: UpdateCropDto) {
    const farmId = request.user.farmId;
    // resolve type if being updated
    if (updateCropDto.type) {
      updateCropDto.type = await this.resolveCropType(
        request,
        updateCropDto.type,
      );
    }

    const updatedCrop = await this.cropRepository.update(
      farmId,
      id,
      updateCropDto,
    );

    if (!updatedCrop) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }
    return {
      message: 'Crop updated successfully',
      data: updatedCrop,
    };
  }

  async delete(request: Request, id: string) {
    const farmId = request.user.farmId;
    const removedCrop = await this.cropRepository.delete(farmId, id);

    if (!removedCrop) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }
    return {
      message: 'Crop removed successfully',
      data: removedCrop,
    };
  }
}
