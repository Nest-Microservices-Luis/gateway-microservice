import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { NATS_SERVICES } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICES) private readonly client: ClientProxy,
  ) { }

  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return firstValueFrom(
      this.client.send('auth.register.user', registerUserDto).pipe(
        catchError(error => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return firstValueFrom(
      this.client.send('auth.login.user', loginUserDto).pipe(
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
