import { Injectable, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthSocketJWTGuard } from '../auth/guard/auth.guard';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  @UseGuards(AuthSocketJWTGuard)
  handleConnection(socket: Socket): void {
    // let resp = new AuthSocketJWTGuard().canActivate(socket);

    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });
    // Handle other events and messages from the client
  }

  emitData() {
    // Socket;
  }
  // Add more methods for handling events, messages, etc.
}
