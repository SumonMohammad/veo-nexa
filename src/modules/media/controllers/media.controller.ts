import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MediaService } from '../services/media.service';
import { GenerateImageDto } from '../dtos/generate-image.dto';
//import { HmacAuthGuard } from 'src/common/guards/hmac-auth.guard';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('generate-image')
 // @UseGuards(HmacAuthGuard) // 👈 Apply HMAC guard here
  async generateImage(@Body() dto: GenerateImageDto) {
    const url = await this.mediaService.generateImage(dto);
    return { imageUrl: url };
  }
}



