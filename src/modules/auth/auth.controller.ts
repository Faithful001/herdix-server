import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CustomMessage } from 'src/common/decorators/custom-message.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';
import { OtpGuard } from 'src/common/guards/otp.guard';
import { OtpPurposeDecorator } from 'src/common/decorators/otp-purpose.decorator';
import { OtpPurpose } from '../otp/enums/otp-purpose.enum';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully registered.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @CustomMessage('User registered successfully')
  create(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @CustomMessage('User logged in successfully')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request for forgot password otp' })
  @ApiResponse({
    status: 200,
    description:
      'The user has been successfully requested for forgot password otp.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiBearerAuth('JWT')
  @HttpCode(200)
  @UseGuards(OtpGuard)
  @OtpPurposeDecorator(OtpPurpose.RESETPASSWORD)
  @ApiOperation({ summary: 'Reset a user password' })
  @ApiResponse({
    status: 200,
    description: 'The user password has been successfully reset.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  resetPassword(
    @Req() req: Request,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(req, resetPasswordDto);
  }
}
