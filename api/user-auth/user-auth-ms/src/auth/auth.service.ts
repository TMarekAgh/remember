import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { AuthSource } from 'src/enums/auth-source.enum';
import { UserAuthAssoc, UserAuthAssocDocument } from 'src/schemas/user-auth-assoc.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor
    (
        public usersService: UsersService, 
        private jwtService: JwtService,
        private httpService: HttpService,
        private config: ConfigService,
        @InjectModel(UserAuthAssoc.name) private userAuthAssocModel: Model<UserAuthAssocDocument>
    ) {}

    public clientId = this.config.get<string>('GITHUB_CLIENT_ID');
    public clientSecret = this.config.get<string>('GITHUB_CLIENT_SECRET');
    public githubLoginUrl = this.config.get<string>('GITHUB_LOGIN_URL');
    public githubApiUrl = this.config.get<string>('GITHUB_API_URL');
    public githubTokenUrl = this.config.get<string>('GITHUB_TOKEN_URL');
    
    async login(user: any) {
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload)
        } 
    }

    async getGithubLoginLink() {
        return `${this.githubLoginUrl}?client_id=${this.clientId}&scope=read:user`;
    }

    async getGithubToken(code: string) {
        const result = await lastValueFrom(this.httpService.post(`${this.githubTokenUrl}`, {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code,            
            }, 
            { headers: { 'Accept': 'application/json' }
        }));

        return result.data.access_token;
    }

    async getGithubUserData(token: string) {
        const result = await lastValueFrom(this.httpService.get(`${this.githubApiUrl}/user`, {
            headers: { 'Authorization': `token ${token}`  }
        }))

        return result.data;
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
            username: data.login, 
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
