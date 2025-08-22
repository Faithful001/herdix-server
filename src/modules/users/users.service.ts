import { Injectable, NotFoundException } from '@nestjs/common';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRepository } from './user.repository';
import { Request } from 'express';
import { UserRole } from './enums/user-role.enum';
import { UserDocument } from './users.schema';
import { CustomMessage } from 'src/common/decorators/custom-message.decorator';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAllFarmers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAllUsers(UserRole.FARMER);
    if (!users) {
      throw new NotFoundException(`User not found`);
    }

    const farmerUsers = users.map((user) => this.toResponseDto(user));
    return farmerUsers;
  }

  async findAllManagers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAllUsers(UserRole.MANAGER);
    if (!users) {
      throw new NotFoundException(`User not found`);
    }

    const managerUsers = users.map((user) => this.toResponseDto(user));
    return managerUsers;
  }

  async findAllAdmins(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAllUsers(UserRole.ADMIN);
    if (!users) {
      throw new NotFoundException(`User not found`);
    }

    const adminUsers = users.map((user) => this.toResponseDto(user));
    return adminUsers;
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return this.toResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return this.toResponseDto(user);
  }

  async updateEmail(req: Request, email: string): Promise<UserResponseDto> {
    const user_id = req?.user._id;
    const user = await this.userRepository.findUserById(user_id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const updatedUser = await this.userRepository.updateUser(user_id, {
      email,
    });
    return this.toResponseDto(updatedUser);
  }

  async delete(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const deletedUser = await this.userRepository.deleteUser(id);
    deletedUser.password = undefined;
    return this.toResponseDto(deletedUser);
  }

  private toResponseDto(user: UserDocument): UserResponseDto {
    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isPasswordChanged: user.isPasswordChanged,
    };
  }
}
