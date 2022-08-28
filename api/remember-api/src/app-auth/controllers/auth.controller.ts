import {
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('app/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('refresh')
  async refreshToken() {
    await this.authService.refreshToken();

    return true;
  }

  @Post('verify')
  async verifyToken() {
    return await this.authService.verify(); 
  }

  @Get('config')
  async configCheck() {
    return this.authService.getConfig();
  }
}
