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
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config: Record<string, any>) => {
        if (!config.MONGODB_URI) {
          throw new Error('MONGODB_URI is not defined in .env file');
        }
        if (!config.JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined in .env file');
        }
        return config;
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get<string>('REDIS_URL'),
        ttl: 30 * 60, // 30 minutes (seconds)
      }),
      inject: [ConfigService],
    }),
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
  ],
  controllers: [AppController],
  providers: [
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
