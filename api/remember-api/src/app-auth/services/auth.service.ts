import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    @Inject('APP_AUTH_SERVICE') private appAuthClient: ClientProxy,
  ) {
    this.appAuthId = this.configService.get<string>('APP_AUTH_ID');
    this.appAuthToken = this.configService.get<string>('APP_AUTH_TOKEN');

    this.getToken();
  }

  /** Id of the API in app authentication microservice */
  private appAuthId: string;

  /** Token used as a password to retrieve API authentication token */
  private appAuthToken: string;

  /** API authentication token used to authenticate in microservices */
  public token = '';

  /**
   * Used to refresh app authentication token
   */
  async refreshToken() {
    await this.getToken();
  }

  /**
   * Used to verify whether API is authenticated(has valid API authentication token)
   * @returns 
   */
  async verify() {
    if (!this.token) throw new UnauthorizedException('There is no application verification token');

    const result = await lastValueFrom(
      this.appAuthClient.send<VerifyResult>(
        { cmd: 'verify' },
        { auth: { token: this.token } },
      ),
    );

    return result;
  }

  /**
   * Used to retrieve API authentication token based on credentials passed in config 
   */
  private async getToken() {
    try {
      const result = await lastValueFrom(
        this.appAuthClient.send<TokenResult>(
          { cmd: 'login' },
          {
            id: this.appAuthId,
            token: this.appAuthToken,
          },
        ),
      );

      this.token = result.access_token;
    } catch (e) {
        this.token = '';
      throw new UnauthorizedException('There was an error while trying to authenticate application');
    }
  }

  /**
   * Used to retrieve API data from app auth microservice
   * @returns 
   */
  getConfig() {
    return {
      app_auth_id: this.appAuthId,
      app_auth_token: this.appAuthToken,
    };
  }
}

export type TokenResult = {
  access_token: string;
}

export type VerifyResult = {
  appId: string;
  name: string;
}
