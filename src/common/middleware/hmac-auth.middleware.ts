import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class HmacAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const SHARED_SECRET = process.env.HMAC_SECRET || 'my_shared_secret';
    const signatureHeader = req.header('X-Signature') || '';
    const timestamp = req.header('X-Timestamp');
    const rawBody = JSON.stringify(req.body);

    if (!signatureHeader || !timestamp) {
      throw new UnauthorizedException('Missing signature or timestamp');
    }

    const signature = signatureHeader.trim();

    const timeDiff = Math.abs(Date.now() - Number(timestamp));
    if (isNaN(Number(timestamp)) || timeDiff > 5 * 60 * 1000) {
      throw new UnauthorizedException('Invalid or expired timestamp');
    }

    const payload = `${rawBody}|${timestamp}`;
    const computedHmac = crypto
      .createHmac('sha256', SHARED_SECRET)
      .update(payload)
      .digest('hex')
      .trim();

    const clientBuffer = Buffer.from(signature, 'hex');
    const serverBuffer = Buffer.from(computedHmac, 'hex');

    console.log('🧪 Payload:', payload);
    console.log('🧪 HMAC computed:', computedHmac);
    console.log('🧪 HMAC received :', signature);
    console.log('🧪 Buffers equal :', serverBuffer.equals(clientBuffer));

    if (serverBuffer.length !== clientBuffer.length) {
      console.error('⚠️ Signature length mismatch');
      throw new UnauthorizedException('Signature length mismatch');
    }

    try {
      if (!crypto.timingSafeEqual(serverBuffer, clientBuffer)) {
        throw new UnauthorizedException('Invalid HMAC signature');
      }
    } catch (err) {
      console.error('⚠️ timingSafeEqual error:', err.message);
      throw new UnauthorizedException('HMAC comparison failed');
    }

    console.log('✅ HMAC verified. Proceeding to controller...');
    return next(); // ✅ always return after next()
  }
}
