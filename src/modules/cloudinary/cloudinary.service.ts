import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import {
  FileStorage,
  UploadResponse,
} from 'src/common/interfaces/file-storage.interface';
import { Readable } from 'stream';
import { config } from 'dotenv';
config();

@Injectable()
export class CloudinaryService implements FileStorage {
  constructor() {
    this.initializeCloudinary();
  }

  private initializeCloudinary(): void {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(file: Express.Multer.File): Promise<UploadResponse> {
    console.log('upload method from controller reached', file);
    const { buffer, originalname } = file;
    const imageName = originalname?.includes('.')
      ? originalname.split('.')[0]
      : originalname;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: imageName, resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            altText: `Image for ${result.public_id}`,
            thumbnailUrl: cloudinary.url(result.public_id, {
              width: 150,
              height: 150,
              crop: 'fit',
              gravity: 'auto',
            }),
          });
        },
      );

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  }
}
