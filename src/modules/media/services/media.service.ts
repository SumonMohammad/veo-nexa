import { Injectable } from '@nestjs/common';
import { ReplicateService } from 'src/shared/http/replicate.service';
import { S3Service } from 'src/shared/storage/s3.service';
import axios from 'axios';
import { GenerateImageDto } from '../dtos/generate-image.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly replicate: ReplicateService,
    private readonly s3Service: S3Service,
  ) {}

  async generateImage(dto: GenerateImageDto): Promise<string> {
    const { prompt, aspect_ratio = '1:1' } = dto;

    const output = await this.replicate.run(
      'google/imagen-4-fast:0e0b2d7a428011274e5b3ba10fc7b77d3603371c4ec86fb3cbd3cdfdca49e0d4',
      {
        prompt,
        aspect_ratio,
      },
    );
   console.log("Output of api URL ", output)
    // Validate
if (!output || typeof output !== 'string' || !output.startsWith('http')) {
  throw new Error('Invalid output from Replicate');
}

// ✅ Fix: use directly instead of output[0]
const imageResponse = await axios.get(output, {
  responseType: 'arraybuffer',
});

const buffer = Buffer.from(imageResponse.data);
const s3Url = await this.s3Service.uploadFile(
  buffer,
  `generated-${Date.now()}.png`,
  'image/png'
);

return s3Url;
  }
}
