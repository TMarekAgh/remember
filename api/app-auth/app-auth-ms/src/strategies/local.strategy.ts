import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { AppService } from "src/app.service";
import { LoginRequest } from "src/models/request/login.request";

/** Strategy used to authenticate application based on passed credentials */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    
    constructor(private appService: AppService) {
        super();    
    }

    async validate(req: LoginRequest): Promise<any> {
        const app = await this.appService.validateApp(req.id, req.token);

        if(!app) {
            throw new UnauthorizedException();
        }

        return app;
    }

}