import { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AppAuthDocument, AppAuth } from './schemas/app-auth.schema';

@Injectable()
export class AppService {

  constructor(
    @InjectModel(AppAuth.name) private apps: Model<AppAuthDocument>,
    private jwtService: JwtService
  ) {}

  /**
   * Finds application by id
   * @param id Id of the application
   * @returns Application
   */
  async find(id: string) {
    const app = await this.apps.findById(id);

    if(!app) throw new NotFoundException('There is no such app registered');

    return app;
  }

  /**
   * Searches for the application identified by id and verifies token equality
   * @param id Id of the application
   * @param token Token used to authenticate
   * @returns Application
   */
  async validateApp(id: string, token: string) {
    const app = await this.apps.findById(id);
    
    if(app.token != token) {
      throw new BadRequestException('Incorrect app credentials');
    }

    return app;
  }

  /**
   * Returns JWT token generated based on application data
   * @param app Application for which to generate token
   * @returns Object containing access token
   */
  async login(app: any) {
    const payload = { name: app.name, sub: app._id }
    return {
      access_token: this.jwtService.sign(payload)
    };
  }  

  /**
   * Verifies whether authentication token is valid
   * @param token Token to be verified
   * @returns Data from token
   */
  async verify(token: string) {
    const data = await this.jwtService.verifyAsync(token);
    return data;
  }
}
