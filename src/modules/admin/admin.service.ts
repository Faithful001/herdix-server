import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminRepository } from './admin.repository';
import Password from 'src/common/utils/password.util';
import { UserRole } from '../user/enums/user-role.enum';
import { EmailService } from 'src/modules/email/email.service';
import { Request } from 'express';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly emailService: EmailService,
  ) {}

  async findAll(request: Request) {
    const farmId = request.user.farmId;
    const admins = await this.adminRepository.findAll(farmId);
    return {
      message: 'Admins fetched successfully',
      data: admins,
    };
  }

  async update(request: Request, id: string, updateAdminDto: UpdateAdminDto) {
    const farmId = request.user.farmId;
    const updatedAdmin = await this.adminRepository.update(
      farmId,
      id,
      updateAdminDto,
    );
    return {
      message: 'Admin updated successfully',
      data: updatedAdmin,
    };
  }
}
