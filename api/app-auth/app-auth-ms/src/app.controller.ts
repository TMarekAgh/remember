import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginRequest } from './models/request/login.request';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LocalAuthGuard)
  @MessagePattern({ cmd: 'login' })
  authenticateApp(@Payload() req: LoginRequest & { user: any }) { //TODO change 'user' to 'app'
    return this.appService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern({ cmd: 'verify' })
  verify(@Payload() req) {
    return req.user;
  }  

  @UseGuards(JwtAuthGuard)
  @MessagePattern({ cmd: 'get' })
  get(@Payload() req) {
    return req.app;
  }  
}
