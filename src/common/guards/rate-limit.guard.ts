// rate-limit.guard.ts
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ThrottlerGuard,
  ThrottlerException,
  ThrottlerModuleOptions,
  ThrottlerStorage,
  ThrottlerOptions,
  InjectThrottlerOptions,
  InjectThrottlerStorage,
} from '@nestjs/throttler';
import {
  RATE_LIMIT_KEY,
  RateLimitOptions,
} from '../decorators/rate-limit.decorator';
import { Request } from 'express';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  private readonly logger = new Logger(RateLimitGuard.name);

  constructor(
    @InjectThrottlerOptions()
    protected readonly options: ThrottlerModuleOptions,
    @InjectThrottlerStorage()
    protected readonly storageService: ThrottlerStorage,
    protected readonly reflector: Reflector,
  ) {
    super(options, storageService, reflector);
  }

  private async resolve<T>(
    value: T | ((ctx: ExecutionContext) => T | Promise<T>),
    ctx: ExecutionContext,
  ): Promise<T> {
    if (typeof value === 'function') {
      return await (value as any)(ctx);
    }
    return value;
  }

  protected async getThrottleOptions(
    context: ExecutionContext,
  ): Promise<RateLimitOptions & { ttl: number; limit: number }> {
    const routeOpts = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (routeOpts) {
      const ttl = await this.resolve(routeOpts.ttl, context);
      const limit = await this.resolve(routeOpts.limit, context);
      return { ...routeOpts, ttl, limit };
    }

    const [defaultThrottler] = this.options as ThrottlerOptions[];

    const ttl = await this.resolve(defaultThrottler?.ttl ?? 60, context);
    const limit = await this.resolve(defaultThrottler?.limit ?? 100, context);
    const name = defaultThrottler?.name;

    return { ttl, limit, name };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const ip = this.getClientIp(req);
    const {
      ttl,
      limit,
      name = 'default',
    } = await this.getThrottleOptions(context);

    const suffix = this.getRequestPath(context);
    const key = this.generateKey(context, suffix, name);

    try {
      const { totalHits } = await this.storageService.increment(
        key,
        ttl * 1000,
        limit,
        ttl * 1000,
        name,
      );

      if (totalHits > limit) {
        throw new ThrottlerException(
          `Rate limit exceeded: ${totalHits} > ${limit} in ${ttl}s`,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ThrottlerException) {
        this.logger.warn(`Rate limit exceeded for ${ip} on ${req.url}`);
        throw error;
      }
      throw error;
    }
  }

  // helpers
  private getClientIp(req: Request): string {
    const forwarded = (req.headers['x-forwarded-for'] as string) ?? '';
    const first = forwarded.split(',')[0]?.trim();
    return first ?? req.socket.remoteAddress ?? 'unknown';
  }

  private getRequestPath(context: ExecutionContext): string {
    const req = context.switchToHttp().getRequest<Request>();
    return req.route?.path ?? req.url.split('?')[0];
  }

  protected generateKey(
    context: ExecutionContext,
    suffix: string,
    name: string = 'throttler',
  ): string {
    const req = context.switchToHttp().getRequest<Request>();
    const ip = this.getClientIp(req);
    const handler = context.getHandler().name;
    const controller = context.getClass().name;
    return `${name}:${ip}:${controller}.${handler}:${suffix}`;
  }
}
