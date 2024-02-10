import { GeneralRespInterceptor } from '@inventory-system/interceptor';
import { UseInterceptors } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';

@UseInterceptors(GeneralRespInterceptor)
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  handleConnection(socket: Socket): void {
    try {
      this.socketService.handleConnection(socket);
    } catch (err) {
      socket.disconnect();
      throw err;
    }
  }

  // Implement other Socket.IO event handlers and message handlers
}
