import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import PasswordUtil from '../../common/utils/password.util';
import { UserDocument } from '../user/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/common/enums/token.enum';
import { UserRole } from '../user/enums/user-role.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Request } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { OtpService } from '../otp/otp.service';
import { OtpPurpose } from '../otp/enums/otp-purpose.enum';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OtpRepository } from '../otp/otp.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly otpRepository: OtpRepository,
  ) {}

  /*
   * Register a new user
   * @param createUserDto
   * @returns { UserResponseDto }
   */
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

    if (createUserDto.role === UserRole.ADMIN) {
      createUserDto['isPasswordChanged'] = true;
    }
    // Create user
    const user = await this.userRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    const returnedUser = this.toResponseDto(user);
    return returnedUser;
  }

  /*
   * Login a user
   * @param loginDto (email, password, role)
   * @returns { user: UserResponseDto; token: string }
   */
  async login(
    loginDto: LoginDto,
  ): Promise<{ user: UserResponseDto; token: string }> {
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
    return {
      user: returnedUser,
      token: this.jwtService.sign({
        sub: user._id,
        purpose: Token.AUTHORIZATION,
        email: user.email,
        role: user.role,
      }),
    };
  }

  /*
   * Change a user's password
   * @param request
   * @param changePasswordDto
   * @returns { message: string, data: null }
   */
  async changePassword(request: Request, changePasswordDto: ChangePasswordDto) {
    const userId = request.user._id;
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isCorrectPassword = await PasswordUtil.comparePassword(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    const hashedNewPassword = await PasswordUtil.hashPassword(
      changePasswordDto.newPassword,
    );
    user.password = hashedNewPassword;
    user.isPasswordChanged = true;
    await user.save();

    return { message: 'Password saved successfully', data: null };
  }

  //request for reset password otp
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository.findUserByEmail(
      forgotPasswordDto.email,
    );

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const otp = await this.otpService.sendOtp({
      email: user.email,
      purpose: OtpPurpose.RESETPASSWORD,
    });

    return otp;
  }

  /*
   * Reset a user's password - This is a protected route using the token from otp-verification
   * @param req
   * @param resetPasswordDto
   * @returns { message: string, data: null }
   */
  async resetPassword(req: Request, resetPasswordDto: ResetPasswordDto) {
    const userId = req.user._id;
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const hashedNewPassword = await PasswordUtil.hashPassword(
      resetPasswordDto.password,
    );
    user.password = hashedNewPassword;
    user.isPasswordChanged = true;
    await user.save();

    const otpId = req.otp._id;
    await this.otpRepository.deleteOtpById(otpId);

    return { message: 'Password reset successfully', data: null };
  }

  private toResponseDto(user: UserDocument): UserResponseDto {
    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isPasswordChanged: user.isPasswordChanged,
      farmId: user.farmId,
    };
  }
}
