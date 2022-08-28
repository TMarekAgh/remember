import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  
  constructor
  (
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}
    
    async findOne(userId: string): Promise<UserDocument | undefined> {
      return await this.userModel.findOne({ _id: userId });
    }

    async findByCredentials(username, password): Promise<UserDocument | undefined> {
      return await this.userModel.findOne({ username, password });
    }

    async createUser({ username, password }) {
      const user = await this.userModel.create({
        username,
        password
      });

      return user;
    }

    async checkNameAvailable(username) {
      return (await this.userModel.find({ username })).length == 0;
    }
}