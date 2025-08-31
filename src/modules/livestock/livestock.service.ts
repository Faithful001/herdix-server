import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateLivestockDto,
  BulkCreateLivestockDto,
} from './dto/create-livestock.dto';
import { UpdateLivestockDto } from './dto/update-livestock.dto';
import { LivestockRepository } from './livestock.repository';
import { LivestockTypeRepository } from '../livestock-type/livestock-type.repository';

@Injectable()
export class LivestockService {
  // {name: id}
  private typeCache = new Map<string, string>(); // cache for livestock types

  constructor(
    private readonly livestockRepository: LivestockRepository,
    private readonly livestockTypeRepository: LivestockTypeRepository,
  ) {}

  /** Utility: resolve livestock type with caching */
  private async resolveLivestockType(typeName: string): Promise<string> {
    if (this.typeCache.has(typeName)) {
      return this.typeCache.get(typeName);
    }
    const livestockType =
      await this.livestockTypeRepository.findByName(typeName);
    if (!livestockType) throw new Error('Invalid livestock type');

    const typeId = livestockType._id.toString();
    this.typeCache.set(typeName, typeId);
    return typeId;
  }

  async create(createLivestockDto: CreateLivestockDto) {
    const typeId = await this.resolveLivestockType(createLivestockDto.type);
    const createdLivestock = await this.livestockRepository.create({
      ...createLivestockDto,
      type: typeId,
    });

    return {
      message: 'One livestock created successfully',
      data: createdLivestock,
    };
  }

  async createMany(createLivestockDtos: CreateLivestockDto[]) {
    if (!createLivestockDtos || createLivestockDtos.length === 0) {
      return {
        message: 'No livestock provided',
        data: { livestock: [], amount: 0 },
      };
    }

    // assume all livestock share the same type
    const typeId = await this.resolveLivestockType(createLivestockDtos[0].type);

    const mappedDtos = createLivestockDtos.map((dto) => ({
      ...dto,
      type: typeId,
    }));

    const createdLivestock =
      await this.livestockRepository.createMany(mappedDtos);

    return {
      message: 'Many livestock created successfully',
      data: { livestock: createdLivestock, amount: mappedDtos.length },
    };
  }

  async createBulk(createLivestockDto: BulkCreateLivestockDto) {
    const typeId = await this.resolveLivestockType(createLivestockDto.type);

    const bulkDtos = Array.from(
      { length: createLivestockDto.quantity },
      () => ({
        ...createLivestockDto,
        type: typeId,
      }),
    );

    const createdLivestock =
      await this.livestockRepository.createMany(bulkDtos);

    return {
      message: 'Bulk livestock created successfully',
      data: {
        livestock: createdLivestock,
        quantity: bulkDtos.length,
      },
    };
  }

  async findAll() {
    const livestock = await this.livestockRepository.findAll();

    return {
      message: 'Livestock fetched successfully',
      data: livestock,
    };
  }

  async findOne(id: string) {
    const livestock = await this.livestockRepository.findById(id);
    if (!livestock) {
      throw new NotFoundException(`Livestock with id ${id} not found`);
    }
    return {
      message: 'Livestock fetched successfully',
      data: livestock,
    };
  }

  async findManyByType(type: string) {
    const livestock =
      await this.livestockRepository.findManyByLivestockType(type);

    if (!livestock || livestock.length === 0) {
      throw new NotFoundException(`No livestock found for the type ${type}`);
    }

    return {
      message: `Livestocks of type ${type} fetched successfully`,
      data: livestock,
    };
  }

  async update(id: string, updateLivestockDto: UpdateLivestockDto) {
    // resolve type if being updated
    if (updateLivestockDto.type) {
      updateLivestockDto.type = await this.resolveLivestockType(
        updateLivestockDto.type,
      );
    }

    const updatedLivestock = await this.livestockRepository.update(
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

  async delete(id: string) {
    const removedLivestock = await this.livestockRepository.delete(id);

    if (!removedLivestock) {
      throw new NotFoundException(`Livestock with id ${id} not found`);
    }
    return {
      message: 'Livestock removed successfully',
      data: removedLivestock,
    };
  }
}
