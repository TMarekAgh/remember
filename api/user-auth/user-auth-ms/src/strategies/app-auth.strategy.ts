import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

/**
 * Strategy used to retrieve and validate app authentication token from request
 */
@Injectable()
export class AppAuthStrategy extends PassportStrategy(Strategy, 'app') {
    
    constructor(
        @Inject('APP_AUTH_SERVICE') private appAuthClient: ClientProxy 
    ) {
        super();    
    }

    async validate(req: { auth: { token: string }, app: any}): Promise<any> {
        
        const token = req.auth?.token;
        
        if(!token) throw new UnauthorizedException('There is no app authentication token in request');

        const result = await lastValueFrom(
          this.appAuthClient.send<any>(
            { cmd: 'verify' },
            { auth: { token: token }},
          ),
        );

        if (!result) throw new UnauthorizedException('Application is not authenticated');

        req.app = result;

        return {};
    }

}