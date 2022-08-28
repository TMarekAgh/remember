import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AppAuthRegisterRequest } from './models/request/app-auth-register.request';

@Controller('apps')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async registerApp(@Body() body: AppAuthRegisterRequest) {
    const app = await this.appService.register(body.name);

    return app;
  }

  @Delete(':id')
  async unregisterApp(@Param('id') id: string) {
    const app = await this.appService.unregister(id);

    return !!app;
  }

  @Post(':id/token')
  async regenerateToken(@Param('id') id: string) {
    return false;
  }
}
