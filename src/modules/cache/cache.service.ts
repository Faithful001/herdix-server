import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<T> {
    return this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T): Promise<T> {
    return this.cacheManager.set<T>(key, value);
  }

  async del(key: string): Promise<boolean> {
    return this.cacheManager.del(key);
  }

  async clear(): Promise<void> {
    await this.cacheManager.clear();
  }
}
