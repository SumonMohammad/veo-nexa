import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ReplicateService {
  private readonly logger = new Logger(ReplicateService.name);
  private readonly baseUrl = 'https://api.replicate.com/v1/predictions';
  private readonly headers: Record<string, string>;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get('REPLICATE_API_TOKEN');
    this.headers = {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async run(version: string, input: Record<string, any>) {
    try {
      const res = await axios.post(
        this.baseUrl,
        {
          version,
          input,
        },
        { headers: this.headers },
      );

      const prediction = res.data;
      const getUrl = `${this.baseUrl}/${prediction.id}`;

      // Poll until it's done
      while (
        prediction.status !== 'succeeded' &&
        prediction.status !== 'failed'
      ) {
        await new Promise((r) => setTimeout(r, 2000));
        const check = await axios.get(getUrl, { headers: this.headers });
        if (check.data.status === 'succeeded') {
          return check.data.output;
        } else if (check.data.status === 'failed') {
          throw new Error('Replicate generation failed');
        }
      }
    } catch (err) {
      this.logger.error('Replicate API error', err.response?.data || err);
      throw new Error('Replicate API failed');
    }
  }
}
