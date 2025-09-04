import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadBase64(base64: string, folder = 'products'): Promise<{ url: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64,
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url });
        },
      );
    });
  }
}
