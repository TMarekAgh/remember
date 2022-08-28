import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Used to retriever and validate user authentication token from request
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: (req) => req.token,
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_SECRET'),
            
        });
    }

    async validate(payload: any) {
        if(!payload) throw new UnauthorizedException('There is no user authentication token present in reqeust')
        return { userId: payload.sub, username: payload.username }
    }
}