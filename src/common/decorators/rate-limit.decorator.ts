// rate-limit.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'RATE_LIMIT';

export interface RateLimitOptions {
  ttl: number | ((ctx: ExecutionContext) => number | Promise<number>);
  limit: number | ((ctx: ExecutionContext) => number | Promise<number>);
  name?: string;
}

export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);
