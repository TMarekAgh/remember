import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { v4 } from 'uuid';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Commands, Requests, Responses } from '@nihilsheji/user-auth-common';
import { AppAuthGuard } from './guards/app-auth.guard';

@Controller()
@UseGuards(AppAuthGuard)
export class AppController {

  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private config: ConfigService
  ) {}
  
  public clientId = this.config.get<string>('GITHUB_CLIENT_ID');
  public clientSecret = this.config.get<string>('GITHUB_CLIENT_SECRET');
  public githubLoginUrl = this.config.get<string>('GITHUB_LOGIN_URL');

  authorizeUrl: string = `${this.githubLoginUrl}?` + 
    `client_id=${this.clientId}&` +
    `client_secret=${this.clientSecret}&` +
    `state=${ v4() }`;

  
  @MessagePattern(Commands.Login)
  @UseGuards(AuthGuard('local'))
  async login(@Payload() req): Promise<Responses.LoginResponse> {
    return this.authService.login(req.user)
  }

  @MessagePattern({ cmd: 'refresh' }) //TODO add to common
  @UseGuards(AuthGuard('jwt'))
  async refresh(@Payload() req): Promise<Responses.LoginResponse> {
    return this.authService.login(req.user)
  }

  @MessagePattern(Commands.GithubLoginLink)
  async githubLoginLink(@Payload() req) //TODO fix Requests.GithubLoginLinkRequest 
  {
    return await this.authService.getGithubLoginLink();
  }

  @MessagePattern(Commands.GithubLogin)
  @UseGuards(AuthGuard('github'))
  async githubLogin(@Payload() req: Requests.GithubLoginRequest & Requests.UserAuthRequest):
    Promise<Responses.GithubLoginResponse | { userId: string }> //TODO Make type extend 
  {
    const userId = (<any>req).user.id;
    const loginData = await this.authService.login(req.user);

    return { ...loginData, userId}
  }

  @MessagePattern(Commands.Verify)
  @UseGuards(AuthGuard('jwt'))
  async verify(@Payload() req: Requests.UserAuthRequest): Promise<Responses.VerifyResponse> {
    return req.user;
  }

  @MessagePattern(Commands.Get)
  async get(@Payload() req: Requests.GetUserRequest): Promise<Responses.UserResponse> {
    const user = await this.appService.find(req.userId);

    const result = {
      id: user.id,
      username: user.username
    }

    return result;
  }

  @MessagePattern(Commands.Register)
  async registerUser(@Payload() req: Requests.RegisterRequest) { //TODO RegisterResponse missing
    const user = {
      username: req.username,
      password: req.password
    };

    return await this.appService.register(req);
  }  
}

export type FilterRequest = {
  username?: string;
}