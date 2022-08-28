import { Model } from 'mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { UserAuthAssoc, UserAuthAssocDocument } from './schemas/user-auth-assoc.schema';
import { UsersService } from './users/users.service';
import { AuthSource } from './enums/auth-source.enum';

@Injectable()
export class AppService {

  constructor
  (
      public usersService: UsersService, 
      private jwtService: JwtService,
      @InjectModel(UserAuthAssoc.name) private userAuthAssocModel: Model<UserAuthAssocDocument>
  ) {}
  
  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
        access_token: this.jwtService.sign(payload)
    } 
  }

  async register(user: any) {
    const nameAvailable = await this.usersService.checkNameAvailable(user.username);
    
    if(!nameAvailable) return new HttpException({
        error: 'Username is already taken'
    }, 400);

    return await this.usersService.createUser(user);
  }

  async validateUser(username: string, password: string) {
      const user = await this.usersService.findByCredentials(username, password);

      return user;
  }

  async find(userId: string) {
    const user = await this.usersService.findOne(userId);

    return user;
  }

  async findOrCreateByAssociation(src: AuthSource, id, data) {
      const assoc = await this.userAuthAssocModel.findOne({
          authSource: src, 
          srcId: id
      });

      if(assoc) {
          return await this.usersService.findOne(assoc.userId);
      }

      const user = await this.usersService.createUser({ 
          username: data.username, 
          password: null 
      });

      await this.userAuthAssocModel.create({
          userId: user._id,
          srcId: id,
          authSource: src
      });

      return user;
  }
}
