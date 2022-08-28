import { Injectable, Injector } from '@angular/core';
import { firstValueFrom, Subject, take } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { HttpService } from '../../shared/services/http.service';
import { NodeService } from './node.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public baseSocketUrl: string;
  public socket: Socket | null = null;
  public connected: boolean = false;
  public connectionPromise: any;
  public connectionEstabilished: Subject<boolean> = new Subject();

  constructor(
    private injector: Injector
  ) {
    console.log(`Initiation grapher socket connection to ${environment.apiUrl + '/ws/node'}`);

    this.baseSocketUrl = environment.apiUrl.replace('https', 'wss').replace('http', 'wss'); //TODO change

    this.init();

    this.connectionEstabilished.subscribe((value) => {
      console.log('Connection estabilished');
      console.log(value);
    })

  }

  init() {
    let socket = io(this.baseSocketUrl + '/node');

    socket.on('connect', () => {
      console.log('Connected');
      this.connected = true;
      this.connectionEstabilished.next(true);
      socket.emit('test');
    })

    socket.on('disconnected', (reason: any) => {
      console.log('Disconnected');
      console.log(reason)
      this.connected = false;
    })

    //Add further actions here

    socket.on('objectModified', this.onObjectModified)

  }

  async getConnection() {
    return new Promise(async resolve => {
      if(this.connected) {
        console.log('Already connected');
        resolve(this.socket)
      } else {
        console.log('Waiting for connection to be established');
        let connection = await firstValueFrom(this.connectionEstabilished.pipe(take(1)))
        resolve(connection);
      }
    })
  }

  async subscribeToObject(objectId: string) {
    this.socket?.emit('subscribeToObject', objectId);
  }

  async unsubscribeToObject(objectId: string) {
    this.socket?.emit('unsubscribeToObject', objectId);
  }

  //Handlers

  async onObjectModified(objectId: string) {
    let nodeService = this.injector.get(NodeService);

    nodeService.onNodeModified(objectId);
  }

}
