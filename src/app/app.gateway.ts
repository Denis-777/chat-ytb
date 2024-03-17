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
  async handleSendMessage(client: Socket, payload: Prisma.ChatCreateInput,): Promise<void> {
     try {
      const createdMessage = await this.appservice.createMessage(payload);

      const messageId = createdMessage.id;

       this.server.emit('recMessage', { ...payload, id: messageId });
       
    } catch (error) {
      
    }
  }
  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(client: Socket, id: number): Promise<void> {
   
    await this.appservice.deleteMessage(id);
    
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
