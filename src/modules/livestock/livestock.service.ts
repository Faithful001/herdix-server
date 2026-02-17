import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateLivestockDto,
  BulkCreateLivestockDto,
} from './dto/create-livestock.dto';
import { UpdateLivestockDto } from './dto/update-livestock.dto';
import { LivestockRepository } from './livestock.repository';
import { LivestockTypeRepository } from '../livestock-type/livestock-type.repository';
import { Request } from 'express';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class LivestockService {
  // {name: id}

  constructor(
    private readonly livestockRepository: LivestockRepository,
    private readonly livestockTypeRepository: LivestockTypeRepository,
    private readonly cacheService: CacheService,
  ) {}

  /** Utility: resolve livestock type with caching */
  private async resolveLivestockType(
    farmId: string,
    typeName: string,
  ): Promise<string> {
    if (this.cacheService.get('livestock-type-' + farmId + '-' + typeName)) {
      return await this.cacheService.get(
        'livestock-type-' + farmId + '-' + typeName,
      );
    }
    const livestockType = await this.livestockTypeRepository.findByName(
      farmId,
      typeName,
    );
    if (!livestockType) throw new Error('Invalid livestock type');

    const typeId = livestockType._id.toString();
    await this.cacheService.set(
      'livestock-type-' + farmId + '-' + typeName,
      typeId,
    );
    return typeId;
  }

  async create(request: Request, createLivestockDto: CreateLivestockDto) {
    const farmId = request.user.farmId;
    const typeId = await this.resolveLivestockType(
      farmId,
      createLivestockDto.type,
    );
    const createdLivestock = await this.livestockRepository.create(farmId, {
      ...createLivestockDto,
      type: typeId,
    });

    return {
      message: 'One livestock created successfully',
      data: createdLivestock,
    };
  }

  async createMany(
    request: Request,
    createLivestockDtos: CreateLivestockDto[],
  ) {
    const farmId = request.user.farmId;
    if (!createLivestockDtos || createLivestockDtos.length === 0) {
      return {
        message: 'No livestock provided',
        data: { livestock: [], amount: 0 },
      };
    }

    // assume all livestock share the same type
    const typeId = await this.resolveLivestockType(
      farmId,
      createLivestockDtos[0].type,
    );

    const mappedDtos = createLivestockDtos.map((dto) => ({
      ...dto,
      type: typeId,
    }));

    const createdLivestock = await this.livestockRepository.createMany(
      farmId,
      mappedDtos,
    );

    return {
      message: 'Many livestock created successfully',
      data: { livestock: createdLivestock, amount: mappedDtos.length },
    };
  }

  async createBulk(
    request: Request,
    createLivestockDto: BulkCreateLivestockDto,
  ) {
    const farmId = request.user.farmId;
    const typeId = await this.resolveLivestockType(
      farmId,
      createLivestockDto.type,
    );

    const bulkDtos = Array.from(
      { length: createLivestockDto.quantity },
      () => ({
        ...createLivestockDto,
        type: typeId,
      }),
    );

    const createdLivestock = await this.livestockRepository.createMany(
      farmId,
      bulkDtos,
    );

    return {
      message: 'Bulk livestock created successfully',
      data: {
        livestock: createdLivestock,
        quantity: bulkDtos.length,
      },
    };
  }

  async findAll(request: Request) {
    const farmId = request.user.farmId;
    const livestock = await this.livestockRepository.findAll(farmId);

    return {
      message: 'Livestock fetched successfully',
      data: livestock,
    };
  }

  async findOne(request: Request, id: string) {
    const farmId = request.user.farmId;
    const livestock = await this.livestockRepository.findById(farmId, id);
    if (!livestock) {
      throw new NotFoundException(`Livestock with id ${id} not found`);
    }
    return {
      message: 'Livestock fetched successfully',
      data: livestock,
    };
  }

  async findManyByType(request: Request, type: string) {
    const farmId = request.user.farmId;
    const livestock = await this.livestockRepository.findManyByLivestockType(
      farmId,
      type,
    );

    if (!livestock || livestock.length === 0) {
      throw new NotFoundException(`No livestock found for the type ${type}`);
    }

    return {
      message: `Livestocks of type ${type} fetched successfully`,
      data: livestock,
    };
  }

  async update(
    request: Request,
    id: string,
    updateLivestockDto: UpdateLivestockDto,
  ) {
    const farmId = request.user.farmId;
    // resolve type if being updated
    if (updateLivestockDto.type) {
      updateLivestockDto.type = await this.resolveLivestockType(
        farmId,
        updateLivestockDto.type,
      );
    }

    const updatedLivestock = await this.livestockRepository.update(
      farmId,
      id,
      updateLivestockDto,
    );

    if (!updatedLivestock) {
      throw new NotFoundException(`Livestock with id ${id} not found`);
    }
    return {
      message: 'Livestock updated successfully',
      data: updatedLivestock,
    };
  }

  async delete(request: Request, id: string) {
    const farmId = request.user.farmId;
    const removedLivestock = await this.livestockRepository.delete(farmId, id);

    if (!removedLivestock) {
      throw new NotFoundException(`Livestock with id ${id} not found`);
    }
    return {
      message: 'Livestock removed successfully',
      data: removedLivestock,
    };
  }
}
