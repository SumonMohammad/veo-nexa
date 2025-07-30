import { Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';
import { GenerateVideoUseCase } from './use-cases/generate-video.usecase';
import { S3Service } from 'src/shared/storage/s3.service';
import { ReplicateService } from 'src/shared/http/replicate.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    GenerateVideoUseCase,
    S3Service,
    ReplicateService,
  ],
})
export class MediaModule {}


