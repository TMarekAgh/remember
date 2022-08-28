import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppAuth, AppAuthDocument } from './schemas/app-auth.schema';

@Injectable()
export class AppService {

  constructor(
    @InjectModel(AppAuth.name) private apps: Model<AppAuthDocument>,
  ) {}

  async register(name: string) {
    const token = randomBytes(20).toString('hex');
    
    const app = await this.apps.create({
      name, 
      token
    });

    return app;
  }

  async unregister(id: string) {
    const result = await this.apps.findByIdAndRemove(id).exec();

    return result;
  }

  async regenerateToken(id: string) {
    const token = randomBytes(20).toString('hex');

    const app = await this.apps.findById(id).exec();

    app.token = token;

    app.save();

    return token;
  }
}
