import express from 'express';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

declare global {
  namespace Express {
    interface Request {
      user?: UserResponseDto;
    }
  }
}
