import { SetMetadata } from '@nestjs/common';

export const CUSTOM_STATUS_KEY = 'custom-status';
export const CustomStatus = (status: number) =>
  SetMetadata(CUSTOM_STATUS_KEY, status);
