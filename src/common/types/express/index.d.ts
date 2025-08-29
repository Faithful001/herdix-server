import express from 'express';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';
import { OtpResponseDto } from 'src/modules/otp/dto/otp-response.dto';

declare global {
  namespace Express {
    interface Request {
      user?: UserResponseDto;
      otp?: OtpResponseDto;
    }
  }
}
