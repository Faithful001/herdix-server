import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UserRole } from '../user/enums/user-role.enum';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';

@Injectable()
export class ManagerRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createManagerDto: CreateManagerDto) {
    return this.userModel.create({
      ...createManagerDto,
      role: UserRole.MANAGER,
    });
  }

  async findAll() {
    return this.userModel.find({ role: UserRole.MANAGER }).lean().exec();
  }

  async findById(id: string) {
    return this.userModel
      .findOne({ _id: id, role: UserRole.MANAGER })
      .lean()
      .exec();
  }

  async update(id: string, updateManagerDto: UpdateManagerDto) {
    return this.userModel
      .findOneAndUpdate({ _id: id, role: UserRole.MANAGER }, updateManagerDto, {
        new: true,
      })
      .lean()
      .exec();
  }

  async delete(id: string) {
    return this.userModel
      .findOneAndDelete({ _id: id, role: UserRole.MANAGER })
      .lean()
      .exec();
  }
}
