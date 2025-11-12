import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimitGuard } from '../guards/rate-limit.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time to live in milliseconds (1 minute)
      limit: 10,   // Maximum number of requests within TTL
    }]),
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RateLimitGuard,
    },
  ],
  exports: [ThrottlerModule],
})
export class RateLimitModule {}
