import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    CloudinaryService,
    {
      provide: 'FileStorage',
      useExisting: CloudinaryService,
    },
  ],
})
export class UploadModule {}
