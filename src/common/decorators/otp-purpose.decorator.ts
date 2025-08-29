import { SetMetadata } from '@nestjs/common';
import { OtpPurpose as OtpPurposeEnum } from 'src/modules/otp/enums/otp-purpose.enum';

export const OTP_PURPOSE_KEY = 'otp-purpose';

export const OtpPurposeDecorator = (purpose: OtpPurposeEnum) => {
  return SetMetadata(OTP_PURPOSE_KEY, purpose);
};
