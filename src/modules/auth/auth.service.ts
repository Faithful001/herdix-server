import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import PasswordUtil from '../../common/utils/password.util';
import { UserDocument } from '../users/users.schema';
import { CustomMessage } from 'src/common/decorators/custom-message.decorator';
// import { request } from 'express';
// import { ApiResponse } from 'src/common/types/api-response.type';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(createUserDto: RegisterDto): Promise<UserResponseDto> {
    // Validate password strength
    if (!PasswordUtil.validatePasswordStrength(createUserDto.password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
      );
    }

    // Check for existing user by email
    const existingUser = await this.userRepository.findUserByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email is already taken');
    }

    // Hash the password
    const hashedPassword = await PasswordUtil.hashPassword(
      createUserDto.password,
    );

    // Create user
    const user = await this.userRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    const returnedUser = this.toResponseDto(user);
    return returnedUser;
  }

  async login(loginDto: LoginDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findUserByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await PasswordUtil.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const returnedUser = this.toResponseDto(user);
    return returnedUser;
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
