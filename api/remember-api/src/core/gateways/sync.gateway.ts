import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';

enum SocketEvents {
    SubscribeToObject = 'subscribeToObject',
    UnsubscribeToObject = 'unsubscribeToObject',
    ObjectModified = 'objectModified'
}

@WebSocketGateway({ namespace: '/node', cors: { origin: 'http://localhost:4200' }})
export class SyncGateway implements OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer()
    server: Server;

    handleDisconnect(client: any) {
        // throw new Error("Method not implemented.");
    }

    handleConnection(client: WebSocket, ...args: any[]) {
        client.send('Connection established by API');
    }

    //On object modified handle modification

    @SubscribeMessage(SocketEvents.SubscribeToObject)
    subscribeToObject(
        @ConnectedSocket() client: Socket,
        @MessageBody() objectId: string 
    ) {
        client.join(objectId);
    }

    @SubscribeMessage(SocketEvents.UnsubscribeToObject)
    unsubscribeToObject(
        @ConnectedSocket() client: Socket,
        @MessageBody() objectId: string 
    ) {
        client.leave(objectId);
    }

    onObjectModified(
        objectId: string
    ) {
        this.server.to(objectId).emit(SocketEvents.ObjectModified, objectId);
    }

    onObjectsModified(
        objectIds: string[]
    ) {
        for(const id of objectIds)
            this.server.to(id).emit(SocketEvents.ObjectModified, id);
    }
}

//TODO move interfaces to common

