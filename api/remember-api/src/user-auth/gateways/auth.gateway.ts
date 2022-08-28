import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: '/auth', cors: { origin: 'http://localhost:4200' }})
export class AuthGateway implements OnGatewayConnection, OnGatewayDisconnect {
    
    
    @WebSocketServer()
    server: Server;

    handleDisconnect(client: any) {
        // throw new Error("Method not implemented.");
    }

    handleConnection(client: WebSocket, ...args: any[]) {
        client.send('Connection established by API');
    }

    // /**
    //  * Adds logged user - connection association
    //  */
    // login() {

    // }

    @SubscribeMessage('loggedIn')
    onLoggedIn(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: string
    ) {
        client.join(userId)
    }

    @SubscribeMessage('loggedOut')
    onLoggedOut(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: string
    ) {
        this.logout(userId, LogoutReason.ClientLogout);
    }


    /**
     * Sends logout signal to all client connection associated with logged out user
     */
    logout(userId: string, reason: LogoutReason) {
        this.server.to(userId).emit('logout', reason);
    }

    /**
     * Sends kill connection signal to client
     */
    kill(connectionId: string) {
        this.server.to(connectionId).emit('kill')
    }
}

export enum LogoutReason {
    ClientLogout = 'Logged Out in client'
}