import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import * as crypto from 'crypto';
  
  @Injectable()
  export class HmacAuthGuard implements CanActivate {
    private readonly SHARED_SECRET = process.env.HMAC_SECRET_KEY || 'my_shared_secret';
  
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      const signature = req.header('X-Signature');
      const timestamp = req.header('X-Timestamp');
  
      if (!signature || !timestamp) {
        throw new UnauthorizedException('Missing signature or timestamp');
      }
  
      const now = Date.now();
      const sent = Number(timestamp);
      const diff = Math.abs(now - sent);
  
      if (isNaN(sent) || diff > 5 * 60 * 1000) {
        throw new UnauthorizedException('Invalid or expired timestamp');
      }
  
      const payload = `${JSON.stringify(req.body)}|${timestamp}`;
      const expectedSignature = crypto
        .createHmac('sha256', this.SHARED_SECRET)
        .update(payload)
        .digest('hex');
  
      if (signature !== expectedSignature) {
        throw new UnauthorizedException('Invalid signature');
      }
  
      return true;
    }
  }
  