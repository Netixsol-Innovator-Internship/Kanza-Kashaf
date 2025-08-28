import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }
    const token = auth.slice(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
