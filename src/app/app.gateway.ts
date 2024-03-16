import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { Prisma } from '@prisma/client'
import { AppService } from 'src/app.service';


@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private appservice: AppService) {} 
  @WebSocketServer() server: Server;
  @SubscribeMessage('sendMessage')
  async handleSendMessage( client: Socket, payload: Prisma.ChatCreateInput,): Promise<void> {
    this.appservice.createMessage(payload);
    this.server.emit('recMessage', payload);
  }
  afterInit(server: any) {
    console.log(server);
  }
  handleConnection(client: Socket) { 
    console.log(`Connected ${client.id}`);
  }
  handleDisconnect(client: Socket) { 
    console.log(`Disconnected ${client.id}`);
  }
}
