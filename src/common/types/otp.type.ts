import { OtpPurpose } from 'src/modules/otp/enums/otp-purpose.enum';
import { OtpStatus } from 'src/modules/otp/enums/otp-status.enum';

export interface OtpInterface {
  userId: string;
  purpose: OtpPurpose;
  status: OtpStatus;
  createdAt: string;
  updatedAt: string;
}
