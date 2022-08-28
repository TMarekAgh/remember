import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";

/** 
 * Strategy used to authenticate application based on JWT token.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: (req) => req.auth.token,
            ignoreExpiration: false,
            secretOrKey: config.get<string>('SECRET')
        });
    }

    async validate(payload: any) {
        if(!payload) throw new UnauthorizedException('There is no app authentication token in request');
        return { appId: payload.sub, name: payload.name }
    }

}