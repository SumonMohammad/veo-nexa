// src/app.module.ts
import { Module } from '@nestjs/common';
import { MediaModule } from './modules/media/media.module';
import { ConfigModule } from './shared/config/config.module';

@Module({
  imports: [MediaModule,ConfigModule],
})
export class AppModule {}

