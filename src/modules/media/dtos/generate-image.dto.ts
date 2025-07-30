import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GenerateImageDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsOptional()
  aspect_ratio?: string;
}
