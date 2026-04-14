import { Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { NATS_SERVICES } from 'src/config';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICES) private readonly client: ClientProxy,
  ) { }

  @Post('register')
  async registerUser() {
    return firstValueFrom(
      this.client.send('auth.register.user', {}).pipe(
        catchError(error => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  @Post('login')
  async loginUser() {
    return firstValueFrom(
      this.client.send('auth.login.user', {}).pipe(
        catchError(error => {
          throw new RpcException(error);
        }),
      ),
    );

  }

  @Post('verify')
  async verifyToken() {
    return firstValueFrom(
      this.client.send('auth.verify.user', {}).pipe(
        catchError(error => {
          throw new RpcException(error);
        }),
      ),
    );

  }
}
