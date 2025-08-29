import { PartialType } from '@nestjs/mapped-types';
import { SendOtpDto } from './send-otp.dto';

export class UpdateOtpDto extends PartialType(SendOtpDto) {}
