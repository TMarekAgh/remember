import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { jwtConstants } from "../constants/constants";
import { ExtractJwt, Strategy } from "passport-jwt";

/**
 * Strategy used to check the existence of bearert token in request autorization header
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        });
    }

    async validate(payload: any) {
        return { 
            appId: payload.sub, 
            name: payload.name 
        }
    }
}