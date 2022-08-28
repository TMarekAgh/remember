import { Body, Controller, Get, Inject, Post, Query, Redirect, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserDto } from '../models/dto/user.dto';
import { LoginUserRequest } from '../models/request/login-user.request';
import { RegisterUserRequest } from '../models/request/register-user.request';
import { AuthService } from '../services/auth.service';
import { AuthService as AppAuthService } from './../../app-auth/services/auth.service';

@Controller()
export class AuthController {

    constructor(
        private appAuthService: AppAuthService,
        private authService: AuthService,
        private configService: ConfigService,
        @Inject('USER_AUTH_SERVICE') private userAuthClient: ClientProxy        
    ) {
        const port = this.configService.get<string>('PORT');
        this.baseUrl = 'http://' + this.configService.get<string>('HOST') + (port ? `:${port}/` : '/');
    }

    private baseUrl = '';

  @Post('/user/login')
  async loginUser(@Body() body: LoginUserRequest): Promise<LoginReponse> {
    const result = await lastValueFrom(
      this.userAuthClient.send(
        { cmd: 'login' },
        {
          username: body.username,
          password: body.password,
          auth: { token: this.appAuthService.token }
        },
      ),
    );

    return result;
  }

  @Post('/user/refresh') //TODO refresh request
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req, @Body() body: { token: string }): Promise<LoginReponse> {
    const result = await lastValueFrom(
      this.userAuthClient.send(
        { cmd: 'refresh' },
        {
          token: req.user.token,
          auth: { token: this.appAuthService.token },
        },
      ),
    );

    return result;
  }

  @Get('/user/details')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async userDetails(@Req() req) {
    const userId = req.user.userId;

    const user = await this.authService.findUser(userId);

    const data = {
      userId,
      auth: { token: this.appAuthService.token },
    };

    const innerUser = await lastValueFrom(
      this.userAuthClient.send({ cmd: 'get' }, data),
    );

    if (!user || !innerUser) return null;

    const result: UserDto = {
      id: user._id,
      email: user.email,
      username: innerUser.username,
    };

    return result;
  }

  @Get('/user/login/github')
  @Redirect()
  async getGithubLoginLink() {
    const result = await lastValueFrom(
      this.userAuthClient.send(
        { cmd: 'github-login-link' },
        {
          redirect_uri: `${this.baseUrl}user/login/github/callback`,
          auth: { token: this.appAuthService.token },
        },
      ),
    );

    return {
      url: result,
    };
  }

  @Get('/user/login/github/callback')
  async loginViaGithub(@Query('code') code) {
    const result = await lastValueFrom(
      this.userAuthClient.send(
        { cmd: 'github-login' },
        {
          code: code,
          auth: { token: this.appAuthService.token },
        },
      ),
    );

    const user = await this.authService.findUser(result.userId);

    if (!user) {
      this.authService.createUserForInner(result.userId);
    }

    return result;
  }

  @Get('user/verify')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async verifyUser(@Req() req) {
    return req.user;
  }

  @Post('/user/register')
  async registerUser(@Body() body: RegisterUserRequest): Promise<RegisterUserResponse> {
    const user = await this.authService.createUser(body);

    return user;
  }
}


export type RegisterUserResponse = {
  email: string;
  userId: string;
  displayName: string;
}

export type LoginReponse = {
  access_token: string;
}

export type DetailsReponse = {
  id: string;
  email: string;
  username: string;
  displayName: string;
}

export type UserDetailsResponse = {
  id: string;
  email: string;
  username: string;
  displayName: string;
}