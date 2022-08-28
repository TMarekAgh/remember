import { Injectable, Injector } from '@angular/core';
import { firstValueFrom, Subject, take } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

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
    console.log("Initializing socket connection")
    this.baseSocketUrl = environment.apiUrl.replace('https', 'http'); //TODO change

    this.init();

    this.connectionEstabilished.subscribe((value) => {
      console.log('Connection estabilished');
      console.log(value);
    })

  }

  init() {
    console.log(`Initiation auth socket connection to ${this.baseSocketUrl + '/auth'}`);
    this.socket = io(this.baseSocketUrl + '/auth');

    this.socket.on('connect', () => {
      console.log('Connected');
      this.connected = true;
      this.connectionEstabilished.next(true);
      this.socket?.emit('test');
    })

    this.socket.on('disconnected', (reason: any) => {
      console.log('Disconnected');
      console.log(reason)
      this.connected = false;
    })

    this.socket.on('kill', () => { this.socket?.close() })

    this.socket.on('logout', this.onLogout)

    this.socket.connect()
  }

  async connect() {
    this.socket!.connect();
  }

  async disconnect() {
    this.socket?.disconnect();
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

  private async onLogout() {
    let authService = this.injector.get(AuthService);
    authService.logout();
  }

  async login(userId: string) {
    this.socket?.emit('loggedIn', userId);
  }

  async logout(userId: string) {
    this.socket?.emit('loggedOut', userId);
  }

}
