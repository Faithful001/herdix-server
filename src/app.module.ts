import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PasswordChangedGuard } from './common/guards/password-changed.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { FarmerModule } from './modules/farmer/farmer.module';
import { EmailModule } from './modules/email/email.module';
import { QueueModule } from './modules/queue/queue.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PassportModule } from '@nestjs/passport';
import { OtpModule } from './modules/otp/otp.module';
import { ManagerModule } from './modules/manager/manager.module';
import { LivestockModule } from './modules/livestock/livestock.module';
import { LivestockTypeModule } from './modules/livestock-type/livestock-type.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { UploadModule } from './modules/upload/upload.module';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';
import { CropModule } from './modules/crop/crop.module';
import { CropTypeModule } from './modules/crop-type/crop-type.module';
import { FarmModule } from './modules/farm/farm.module';
import { AiModule } from './modules/ai/ai.module';
import { AdminModule } from './modules/admin/admin.module';
import { SharedJwtModule } from './common/modules/shared-jwt.module';
import { SharedUserModule } from './common/modules/shared-user.module';
import { TaskModule } from './modules/task/task.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { redisStore } from 'cache-manager-redis-store';
import { EventsGateway } from './modules/websocket/gateway/events.gateway';
import { CacheModule } from './modules/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config: Record<string, any>) => {
        const requiredEnvVars = [
          'MONGODB_URI',
          'JWT_SECRET',
          'REDIS_HOST',
          'REDIS_PORT',
        ];

        const missingVars = requiredEnvVars.filter(
          (varName) => !config[varName],
        );
        if (missingVars.length > 0) {
          throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}`,
          );
        }

        return {
          ...config,
          REDIS_PORT: parseInt(config.REDIS_PORT, 10),
          RATE_LIMIT_TTL: config.RATE_LIMIT_TTL
            ? parseInt(config.RATE_LIMIT_TTL, 10)
            : 60,
          RATE_LIMIT_COUNT: config.RATE_LIMIT_COUNT
            ? parseInt(config.RATE_LIMIT_COUNT, 10)
            : 100,
          CACHE_TTL: config.CACHE_TTL ? parseInt(config.CACHE_TTL, 10) : 300, // 5 minutes default
          CACHE_MAX_ITEMS: config.CACHE_MAX_ITEMS
            ? parseInt(config.CACHE_MAX_ITEMS, 10)
            : 1000,
        };
      },
    }),

    // Rate limiting and caching
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60,
        limit: 100,
      },
    ]),
    CacheModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     store: redisStore,
    //     url: configService.get<string>('REDIS_URL'),
    //     ttl: 30 * 60, // 30 minutes (seconds)
    //   }),
    //   inject: [ConfigService],
    // }),
    PassportModule,
    SharedJwtModule,
    SharedUserModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_SECRET'),
    //     signOptions: {
    //       expiresIn: configService.get<string>('JWT_EXPIRATION', '1d'),
    //     },
    //   }),
    // }),
    UserModule,
    AuthModule,
    FarmerModule,
    EmailModule,
    QueueModule,
    OtpModule,
    ManagerModule,
    LivestockModule,
    LivestockTypeModule,
    CloudinaryModule,
    UploadModule,
    CropModule,
    CropTypeModule,
    FarmModule,
    AiModule,
    AdminModule,
    TaskModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [
    EventsGateway,
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: PasswordChangedGuard,
    },
    {
      provide: 'FileStorage', // token for DI
      useClass: CloudinaryService,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(PasswordChangedGuard)
  //     .exclude({ path: 'auth/(.*)', method: RequestMethod.ALL })
  //     .forRoutes('*');
  // }
}
