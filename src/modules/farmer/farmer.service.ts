import { Injectable } from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { FarmerRepository } from './farmer.repository';
import Password from 'src/common/utils/password.util';
import { UserRole } from '../user/enums/user-role.enum';
import { EmailService } from 'src/modules/email/email.service';
import { Request } from 'express';

@Injectable()
export class FarmerService {
  constructor(
    private readonly farmerRepository: FarmerRepository,
    private readonly emailService: EmailService,
  ) {}
  async create(request: Request, createFarmerDto: CreateFarmerDto) {
    const farmId = request.user.farmId;
    const password = Password.generate();
    createFarmerDto['password'] = await Password.hashPassword(password);
    createFarmerDto['role'] = UserRole.FARMER;
    createFarmerDto['isPasswordChanged'] = false;

    this.emailService.queueEmail({
      email: createFarmerDto.email,
      name: createFarmerDto.firstName,
      subject: 'Welcome to Herdix',
      message: `Hello ${createFarmerDto.firstName}, you have successfully created an account on Herdix. Your temporary password is ${password}`,
    });

    await this.farmerRepository.create(farmId, createFarmerDto);
    return {
      message: 'Farmer created successfully',
      data: createFarmerDto,
    };
  }

  async findAll(request: Request) {
    const farmId = request.user.farmId;
    const farmers = await this.farmerRepository.findAll(farmId);
    return {
      message: 'Farmers fetched successfully',
      data: farmers,
    };
  }

  async findOne(request: Request, id: string) {
    const farmId = request.user.farmId;
    const farmer = await this.farmerRepository.findById(farmId, id);
    return {
      message: 'Farmer fetched successfully',
      data: farmer,
    };
  }

  async update(request: Request, id: string, updateFarmerDto: UpdateFarmerDto) {
    const farmId = request.user.farmId;
    const updatedFarmer = await this.farmerRepository.update(
      farmId,
      id,
      updateFarmerDto,
    );
    return {
      message: 'Farmer updated successfully',
      data: updatedFarmer,
    };
  }

  async delete(request: Request, id: string) {
    const farmId = request.user.farmId;
    const deletedFarmer = await this.farmerRepository.delete(farmId, id);
    return {
      message: 'Farmer deleted successfully',
      data: deletedFarmer,
    };
  }
}
