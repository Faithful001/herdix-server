import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OtpPurpose } from 'src/modules/otp/enums/otp-purpose.enum';
import { ApiProperty } from '@nestjs/swagger';
import { OtpStatus } from '../enums/otp-status.enum';

export class OtpResponseDto {
  @ApiProperty({ description: "The user's ID", example: '1234567890abcdef' })
  @IsString()
  _id: string;

  @ApiProperty({ description: 'OTP', example: '123456' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ description: 'User id', example: '123' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Purpose',
    example: OtpPurpose.RESETPASSWORD,
    enum: OtpPurpose,
    enumName: 'OtpPurpose',
  })
  @IsEnum(OtpPurpose, { message: 'Invalid purpose provided' })
  purpose: OtpPurpose;

  @ApiProperty({ description: 'Status', example: 'ACTIVE' })
  @IsEnum(OtpStatus, { message: 'Invalid status provided' })
  status: OtpStatus;
}
