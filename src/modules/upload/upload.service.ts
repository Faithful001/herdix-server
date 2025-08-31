import { Inject, Injectable } from '@nestjs/common';
import {
  FileStorage,
  UploadResponse,
} from 'src/common/interfaces/file-storage.interface';

@Injectable()
export class UploadService {
  constructor(
    @Inject('FileStorage') private readonly fileStorage: FileStorage,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ message: string; data: UploadResponse }> {
    console.log('upload file method reached');
    const uploadResponse = await this.fileStorage.upload(file);
    return { message: 'Upload successful', data: uploadResponse };
  }

  async uploadManyFiles(
    files: Express.Multer.File[],
  ): Promise<{ message: string; data: UploadResponse[] }> {
    const uploadResponses = await Promise.all(
      files.map((file) => this.fileStorage.upload(file)),
    );
    return { message: 'Upload successful', data: uploadResponses };
  }

  async deleteFile(publicId: string): Promise<{ message: string; data: void }> {
    await this.fileStorage.delete(publicId);
    return { message: 'Delete successful', data: null };
  }
}
