import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterUserRequest } from '../models/request/register-user.request';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService as AppAuthService } from 'src/app-auth/services/auth.service';

@Injectable()
export class AuthService {
  constructor(
    private appAuthService: AppAuthService,
    @InjectModel(User.name) private users: Model<UserDocument>,
    @Inject('USER_AUTH_SERVICE') private userAuthClient: ClientProxy,
  ) {}

  async createUser(req: RegisterUserRequest) {
    const result = await firstValueFrom(
      this.userAuthClient.send(
        { cmd: 'register' },
        {
          username: req.username,
          password: req.password,
          auth: {
            token: this.appAuthService.token
          }
        },
      ),
    );

    if (!result) return null;

    const model: User = {
      userId: result._id,
      email: req.email,
      displayName: req.displayName
    };

    const user = await this.users.create(model);

    return user;
  }

  async createUserForInner(id) {
    const model: User = {
      userId: id,
      email: null,
      displayName: ''
    };

    return await this.users.create(model);
  }

  async findUser(userId: string) {
    return await this.users.findOne({ userId });
  }

  async getUsers(userIds: string[]) {
    return await this.users.find({ _id: { $in: userIds } });
  }

  async filter(props: FilterUsersProps) {
    return await this.users.find(props);
  }
}

export type FilterUsersProps = {
  email?: string;  
  displayName?: string;
}
