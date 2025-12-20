import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Events } from './enums/events.enum';

@WebSocketGateway({
  cors: '*',
})
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  server: Server;

  afterInit(server: Server) {
    server.on(Events.ERROR, (err) => {
      console.error('WebSocket error:', err);
    });
  }

  handleConnection(client: Socket) {
    client.emit(Events.CONNECT, { message: 'Connected to WebSocket server' });
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    client.emit(Events.DISCONNECT, {
      message: 'Disconnected from WebSocket server',
    });
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(Events.JOIN_ROOM)
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    client.join(room);
    this.server.to(room).emit(Events.USER_JOINED, {
      message: `User ${client.id} joined room: ${room}`,
    });
  }

  @SubscribeMessage(Events.LEAVE_ROOM)
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    client.leave(room);
    this.server.to(room).emit(Events.USER_LEFT, {
      message: `User ${client.id} left room: ${room}`,
    });
  }

  @SubscribeMessage(Events.MESSAGE)
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    this.server.emit(Events.MESSAGE, {
      message: 'Message received',
      data: payload,
    });
  }
}
