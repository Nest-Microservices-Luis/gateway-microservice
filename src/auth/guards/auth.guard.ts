
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { Request } from 'express';
import { catchError, firstValueFrom } from 'rxjs';
import { NATS_SERVICES } from 'src/config';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    @Inject(NATS_SERVICES) private readonly client: ClientProxy,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {

      const { user, token: newToken } = await firstValueFrom(
        this.client.send('auth.verify.user', token).pipe(
          catchError(error => {
            throw new RpcException(error);
          }),
        ),
      );

      request['user'] = user;
      request['token'] = newToken;
      
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

