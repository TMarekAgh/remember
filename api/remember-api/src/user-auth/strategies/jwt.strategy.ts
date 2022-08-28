import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthService as AppAuthService } from './../../app-auth/services/auth.service';
import { AuthService } from '../services/auth.service';

/**
 * Checks request header for presence of Bearer Token. Then validates user in microservice.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(        
        @Inject('USER_AUTH_SERVICE') private userAuthClient: ClientProxy,
        private appAuthService: AppAuthService,
        private authService: AuthService
    ) {
        super();
    }

    async validate(req: any) {
        const authHeader: string = req.headers.authorization;

        if(!authHeader) return new UnauthorizedException();

        const token = authHeader;

        if(!token) throw new UnauthorizedException('There is no user authentication token in request')

        const innerUser = await firstValueFrom(this.userAuthClient.send({ cmd: 'verify' }, {
            token,
            auth: { token: this.appAuthService.token }
        }));

        const user = await this.authService.findUser(innerUser.userId);
      
        if (!user || !innerUser) return null;
      
        const result = {
          id: user._id.toString(),
          userId: user.userId,
          email: user.email,
          username: innerUser.username,
        };
      

        if(!result) throw new UnauthorizedException('There was an error while authenticating user');

        return { ...result, token };
    }
}