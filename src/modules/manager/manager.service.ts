import { Injectable } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ManagerRepository } from './manager.repository';
import Password from 'src/common/utils/password.util';
import { UserRole } from '../user/enums/user-role.enum';
import { EmailService } from 'src/modules/email/email.service';

@Injectable()
export class ManagerService {
  constructor(
    private readonly managerRepository: ManagerRepository,
    private readonly emailService: EmailService,
  ) {}

  async create(createManagerDto: CreateManagerDto) {
    const password = Password.generate();
    createManagerDto['password'] = await Password.hashPassword(password);
    createManagerDto['role'] = UserRole.MANAGER;
    createManagerDto['isPasswordChanged'] = false;

    this.emailService.queueEmail({
      email: createManagerDto.email,
      name: createManagerDto.firstName,
      subject: 'Welcome to Herdix',
      message: `Hello ${createManagerDto.firstName}, you have successfully created an account on Herdix. Your temporary password is ${password}`,
    });

    const manager = await this.managerRepository.create(createManagerDto);
    return {
      message: 'Manager created successfully',
      data: manager,
    };
  }

  async findAll() {
    const managers = await this.managerRepository.findAll();
    return {
      message: 'Managers fetched successfully',
      data: managers,
    };
  }

  async findOne(id: string) {
    const manager = await this.managerRepository.findById(id);
    return {
      message: 'Manager fetched successfully',
      data: manager,
    };
  }

  async update(id: string, updateManagerDto: UpdateManagerDto) {
    const updatedManager = await this.managerRepository.update(id, updateManagerDto);
    return {
      message: 'Manager updated successfully',
      data: updatedManager,
    };
  }

  async remove(id: string) {
    const deletedManager = await this.managerRepository.delete(id);
    return {
      message: 'Manager deleted successfully',
      data: deletedManager,
    };
  }
}
