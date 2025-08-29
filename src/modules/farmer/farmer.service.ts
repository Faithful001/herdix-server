import { Injectable } from '@nestjs/common';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { FarmerRepository } from './farmer.repository';
import Password from 'src/common/utils/password.util';
import { UserRole } from '../user/enums/user-role.enum';
import { EmailService } from 'src/modules/email/email.service';
import passwordUtil from 'src/common/utils/password.util';

@Injectable()
export class FarmerService {
  constructor(
    private readonly farmerRepository: FarmerRepository,
    private readonly emailService: EmailService,
  ) {}
  async create(createFarmerDto: CreateFarmerDto) {
    const password = Password.generate();
    createFarmerDto['password'] = await passwordUtil.hashPassword(password);
    createFarmerDto['role'] = UserRole.FARMER;
    createFarmerDto['isPasswordChanged'] = false;

    this.emailService.queueEmail({
      email: createFarmerDto.email,
      name: createFarmerDto.firstName,
      subject: 'Welcome to Herdix',
      message: `Hello ${createFarmerDto.firstName}, you have successfully created an account on Herdix. Your temporary password is ${password}`,
    });

    return this.farmerRepository.create(createFarmerDto);
  }

  findAll() {
    return this.farmerRepository.findAll();
  }

  findOne(id: string) {
    return this.farmerRepository.findById(id);
  }

  update(id: string, updateFarmerDto: UpdateFarmerDto) {
    return this.farmerRepository.update(id, updateFarmerDto);
  }

  delete(id: string) {
    return this.farmerRepository.delete(id);
  }
}
