import { Injectable } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ManagerRepository } from './manager.repository';
import Password from 'src/common/utils/password.util';
import { UserRole } from '../user/enums/user-role.enum';
import { EmailService } from 'src/modules/email/email.service';
import { Request } from 'express';

@Injectable()
export class ManagerService {
  constructor(
    private readonly managerRepository: ManagerRepository,
    private readonly emailService: EmailService,
  ) {}

  async create(request: Request, createManagerDto: CreateManagerDto) {
    const farmId = request.user.farmId;
    const password = Password.generate();
    createManagerDto['password'] = await Password.hashPassword(password);
    createManagerDto['role'] = UserRole.MANAGER;
    createManagerDto['isPasswordChanged'] = false;

    this.emailService.queueEmail({
      email: createManagerDto.email,
      name: createManagerDto.firstName,
      subject: 'Welcome to Herdix',
      message: `Hello ${createManagerDto.firstName}, an account has been successfully created for you on Herdix. Your temporary password is ${password}`,
    });

    await this.managerRepository.create(farmId, createManagerDto);

    const { password: _, ...rest } = createManagerDto as CreateManagerDto & {
      password: string;
    };

    return {
      message: 'Manager created successfully',
      data: rest,
    };
  }

  async findAll(request: Request) {
    const farmId = request.user.farmId;
    const managers = await this.managerRepository.findAll(farmId);
    return {
      message: 'Managers fetched successfully',
      data: managers,
    };
  }

  async findOne(request: Request, id: string) {
    const farmId = request.user.farmId;
    const manager = await this.managerRepository.findById(farmId, id);
    return {
      message: 'Manager fetched successfully',
      data: manager,
    };
  }

  async update(
    request: Request,
    id: string,
    updateManagerDto: UpdateManagerDto,
  ) {
    const farmId = request.user.farmId;
    const updatedManager = await this.managerRepository.update(
      farmId,
      id,
      updateManagerDto,
    );
    return {
      message: 'Manager updated successfully',
      data: updatedManager,
    };
  }

  async remove(request: Request, id: string) {
    const farmId = request.user.farmId;
    const deletedManager = await this.managerRepository.delete(farmId, id);
    return {
      message: 'Manager deleted successfully',
      data: deletedManager,
    };
  }
}
