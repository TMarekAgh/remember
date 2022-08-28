import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/http.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { Timer } from '../classes/timer';
import { RegisterModel } from '../models/register.model';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private basePath = '/user';
  private authToken = '';
  private authTokenKey = 'auth-token';
  private authHeader = 'authorization'; //TODO change to authentication in API

  private authTimer = new Timer(
    15 * 60 * 1000,
    5 * 60 * 1000,
    this.listenForAction.bind(this),
    this.logout.bind(this)
  )

  public currentUserData: any;

  private _onLoginStatusChange = new EventEmitter<boolean>();
  public onLoginStatusChange = this._onLoginStatusChange.asObservable();

  //TODO add handling for different login providers

  constructor(
    private readonly http: HttpService,
    private readonly session: SessionStorageService,
    private readonly snackService: SnackBarService,
    private readonly socketService: SocketService,
    private readonly router: Router
  ) {
    this.onRefresh();
  }

  /** Checks for presence of authentication token, serves as a means to prevent unnecesary API calls */
  public get isLoggedIn() {
    return !!this.authToken;
  }

  /**
   * Authorize in the API
   * @param data Username/email and password
   */
  public async login(data: { username: string, password: string }) {
    const response = await this.http.post<any>(`${this.basePath}/login`, data)
      .catch(err => {
        this.snackService.openError('Username or password is incorrect')
      });

    this.authToken = response.access_token;

    const tokenData = parseJwt(this.authToken);

    this.currentUserData = {
      id: tokenData.sub,
      username: tokenData.username
    }

    this.http.setHeader(this.authHeader, this.authToken);
    this.session.set(this.authTokenKey, this.authToken);
    this.socketService.connect();
    this.socketService.login(this.currentUserData.id);
    this.authTimer.start();
    this._onLoginStatusChange.emit(true);
  }

  /**
   * Clear authentication data, which is equivalent to loging out
   */
  public async logout() {
    const userData = this.currentUserData;

    this.authToken = '';
    this.currentUserData = null;

    this.session.remove(this.authTokenKey);
    this.http.removeHeader(this.authHeader);
    this.socketService.logout(userData.userId);
    this.socketService.disconnect();
    this.router.navigate([''])
    this.authTimer.stop();
    this._onLoginStatusChange.emit(false);
  }

  /**
   * Register new user
   * @param data
   * @returns
   */
  public async register(data: RegisterModel) {
    const response = await this.http.post<any>(`${this.basePath}/register`, data);

    return response;
  }

  /**
   * Verify authentication status(validity of authentication token)
   * @returns
   */
  public async verify() {
    const response = await this.http.get(`${this.basePath}/user/verify`);

    return response;
  }

  public async listenForAction() {
    document.onclick = this.refresh.bind(this);
  }

  /**
   * Refresh auth token, effectively prolonging session
   */
  public async refresh() {
    const response = await this.http.post<any>(`${this.basePath}/refresh`, { token: this.authToken });

    this.authToken = response.access_token;

    const tokenData = parseJwt(this.authToken);

    this.currentUserData = {
      id: tokenData.sub,
      username: tokenData.username
    }

    this.http.setHeader(this.authHeader, this.authToken);
    this.session.set(this.authTokenKey, this.authToken);
    this.authTimer.refresh();
  }

  /**
   * Reinitialize data after refresh
   */
  private onRefresh() {
    const authToken = this.session.get(this.authTokenKey);

    if(authToken) {
      this.authToken = authToken;
      const tokenData = parseJwt(this.authToken);

      this.currentUserData = {
        id: tokenData.sub,
        username: tokenData.username
      }

      this.http.setHeader(this.authHeader, this.authToken);
    }
  }

  // public async resetPassword() {}
}

export enum Providers {
  Local,
  Github
}

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
