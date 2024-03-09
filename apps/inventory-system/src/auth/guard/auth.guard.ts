import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthJWTGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide token');
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const resp = await this.authService.validateToken(authToken);
      request.userDetail = resp;
      return true;
    } catch (error) {
      throw new ForbiddenException(
        error.message || 'session expired! Please sign In'
      );
    }
  }
}

@Injectable()
export class AuthSocketJWTGuard implements CanActivate {
  constructor() {}

  private readonly authService: AuthService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      return true;
      // const authToken: string = client.handshake?.query?.token as string;
      // if (!authToken || authToken.trim() === '') {
      //   throw new UnauthorizedException('Please provide token');
      // }
      // const resp = await this.authService.validateToken(authToken);
      // return resp;
    } catch (err) {
      throw new WsException(err.message || 'session expired! Please sign In');
    }
  }
}
