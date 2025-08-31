export interface UploadResponse {
  url: string;
  publicId: string;
  altText?: string;
  thumbnailUrl?: string;
}

export interface FileStorage {
  upload(file: Express.Multer.File): Promise<UploadResponse>;
  delete(publicId: string): Promise<void>;
}
