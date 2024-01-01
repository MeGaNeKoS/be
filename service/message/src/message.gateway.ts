import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { MessageService } from "./message.service";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "@shared/guard/token.service";

interface UserSocket extends Socket {
  user: any;
}

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {
  }

  async handleConnection(client: UserSocket, ...args: any[]) {
    console.log('Client connected');
    console.log('client.handshake.query.token', client.handshake.query.token)
    let token = client.handshake.query.token;
    if (Array.isArray(token)) {
      token = token[0];
    }
    const payload = this.jwtService.verify(token);
    const user = await this.tokenService.validateUserToken(payload.sub, token);
    if (!user) {
      client.disconnect();
      throw new WsException("Unauthorized");
    }
    client.user = user;
  }


  handleDisconnect(client: UserSocket) {
    client.user = null;
  }

  @SubscribeMessage('sendChat')
  async handleChatEvent(@MessageBody() data: any, @ConnectedSocket() client: UserSocket) {
    const newMessage = await this.messageService.create(client.user, data.roomId, data.content);
    this.server.to(data.roomId).emit('newChat', newMessage);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoomEvent(@MessageBody() data: any, @ConnectedSocket() client: UserSocket) {
    client.join(data.roomId);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoomEvent(@MessageBody() data: any, @ConnectedSocket() client: UserSocket) {
    client.leave(data.roomId);
  }
}
