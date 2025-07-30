// import { Injectable } from '@nestjs/common';
// import FormData = require('form-data');
// import { ReplicateService } from 'src/shared/http/replicate.service';
// import axios from 'axios';

// @Injectable()
// export class GenerateVideoUsecase {
//   constructor(private replicateService: ReplicateService) {}

//   async execute(images: Express.Multer.File[]): Promise<Buffer> {
//     const image = images[0]; // For now, just use 1 image
//     const uploadedImageUrl = await this.uploadImageToTmpHost(image);

//     const statusUrl = await this.replicateService.generateVideoFromImage(uploadedImageUrl);
//     const videoUrl = await this.replicateService.pollResultStatus(statusUrl);

//     // Download video as Buffer
//     const response = await axios.get(videoUrl, { responseType: 'arraybuffer' });
//     return Buffer.from(response.data);
//   }

//   private async uploadImageToTmpHost(file: Express.Multer.File): Promise<string> {
//     const formData = new FormData();
//     formData.append('file', file.buffer, file.originalname);
  
//     const response = await axios.post('https://tmpfiles.org/api/v1/upload', formData, {
//       headers: formData.getHeaders(),
//     });
  
//     const tmpUrl = response.data?.data?.url;
//     if (!tmpUrl) throw new Error('Image upload failed');
  
//     return tmpUrl;
//   }
// }


import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/shared/storage/s3.service';
import axios from 'axios';

@Injectable()
export class GenerateVideoUseCase {
  constructor(private readonly s3Service: S3Service) {}

  async execute(): Promise<string> {
    const dummyUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

    try {
      const response = await axios.get(dummyUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);

      const s3Url = await this.s3Service.uploadFile(
        buffer,
        `dummy-video-${Date.now()}.mp4`,
        'video/mp4'
      );

      return s3Url;
    } catch (error) {
      console.error('❌ Dummy video upload failed:', error.message);
      throw new Error('Dummy video upload failed');
    }
  }
}
